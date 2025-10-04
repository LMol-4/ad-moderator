/**
 * AdModeratorClient - Cliente principal para moderación de imágenes
 * 
 * Esta es la clase principal que los usuarios importarán como:
 * import { AdModeratorClient } from 'ad-moderator';
 */

import { AdModerator } from './AdModerator';
import { FunctionAnalyzer } from '../analyzers/ImageAnalyzer';
import { AdModeratorConfig, ModerationOptions, ImageInput, ModerationResult } from '../types';

export class AdModeratorClient {
  private moderator: AdModerator;
  private isInitialized: boolean = false;

  constructor(config?: Partial<AdModeratorConfig>) {
    this.moderator = new AdModerator(config as AdModeratorConfig);
  }

  /**
   * Inicializar el cliente
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Verificar que hay un analyzer configurado
    if (!this.moderator['modelManager']?.['analyzer']) {
      throw new Error('No analyzer configured. Call setAnalysisFunction() or setFirebaseFunction() first.');
    }

    await this.moderator.initialize();
    this.isInitialized = true;
  }

  /**
   * Configurar función de análisis personalizada
   * @param analysisFunction - Función que analiza la imagen
   */
  setAnalysisFunction(analysisFunction: (imageBuffer: Buffer, imageType: string, options: ModerationOptions) => Promise<any[]>): void {
    const analyzer = new FunctionAnalyzer('custom-analyzer', analysisFunction);
    this.moderator.setAnalyzer(analyzer);
  }

  /**
   * Configurar función de Firebase para análisis con Claude
   * @param firebaseFunctionUrl - URL de la función de Firebase
   * @param apiKey - API Key para autenticación (opcional)
   */
  setFirebaseFunction(firebaseFunctionUrl: string, apiKey?: string): void {
    // TODO: Implementar llamada a Firebase Function
    // Esta función será implementada cuando esté lista la función de Firebase
    
    const firebaseAnalyzer = new FunctionAnalyzer('firebase-claude-analyzer', async (imageBuffer: Buffer, imageType: string, options: ModerationOptions) => {
      try {
        // Llamada a la función de Firebase que se comunicará con Claude
        const response = await fetch(firebaseFunctionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
          },
          body: JSON.stringify({
            image: imageBuffer.toString('base64'),
            imageType: imageType,
            options: options
          })
        });

        if (!response.ok) {
          throw new Error(`Firebase function error: ${response.status}`);
        }

        const result = await response.json() as {
          isSafe: boolean;
          confidence?: number;
          severity?: string;
          reason?: string;
        };
        
        // La función de Firebase devuelve un boolean
        // Convertimos a formato de categorías
        if (result.isSafe === false) {
          return [{
            name: 'inappropriate_content',
            confidence: result.confidence || 0.8,
            severity: (result.severity as 'low' | 'medium' | 'high' | 'critical') || 'high',
            reason: result.reason || 'Contenido detectado como inapropiado por Claude'
          }];
        }
        
        return []; // Imagen segura
        
      } catch (error) {
        console.error('Error calling Firebase function:', error);
        // En caso de error, devolver categoría de error
        return [{
          name: 'analysis_error',
          confidence: 1.0,
          severity: 'medium',
          reason: 'Error al analizar la imagen con Claude'
        }];
      }
    });

    this.moderator.setAnalyzer(firebaseAnalyzer);
  }

  /**
   * Moderar una imagen
   * @param image - Imagen a moderar
   * @param options - Opciones de moderación
   * @returns Resultado de la moderación
   */
  async moderateImage(image: ImageInput, options?: Partial<ModerationOptions>): Promise<ModerationResult> {
    if (!this.isInitialized) {
      throw new Error('AdModeratorClient no está inicializado. Llama a initialize() primero.');
    }

    return await this.moderator.moderateImage(image, options);
  }

  /**
   * Moderar múltiples imágenes
   * @param images - Array de imágenes a moderar
   * @param options - Opciones de moderación
   * @returns Array de resultados
   */
  async moderateImages(images: ImageInput[], options?: Partial<ModerationOptions>): Promise<ModerationResult[]> {
    if (!this.isInitialized) {
      throw new Error('AdModeratorClient no está inicializado. Llama a initialize() primero.');
    }

    return await this.moderator.moderateImages(images, options);
  }

  /**
   * Verificar si una imagen es segura para anuncios
   * @param image - Imagen a verificar
   * @param options - Opciones de verificación
   * @returns true si es segura, false si no
   */
  async isImageSafe(image: ImageInput, options?: Partial<ModerationOptions>): Promise<boolean> {
    const result = await this.moderateImage(image, options);
    return result.isSafe;
  }

  /**
   * Obtener estadísticas del cliente
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      version: '1.0.0'
    };
  }

  /**
   * Liberar recursos
   */
  dispose(): void {
    if (this.moderator) {
      this.moderator.dispose();
    }
    this.isInitialized = false;
  }
}

// Función de conveniencia para crear un cliente preconfigurado
export function createAdModeratorClient(config?: Partial<AdModeratorConfig>): AdModeratorClient {
  return new AdModeratorClient(config);
}
