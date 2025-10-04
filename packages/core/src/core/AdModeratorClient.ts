/**
 * AdModeratorClient - Cliente principal para moderación de imágenes
 * 
 * Esta es la clase principal que los usuarios importarán como:
 * import { AdModeratorClient } from 'ad-moderator';
 */

import { AdModerator } from './AdModerator';
import { FunctionAnalyzer } from '../analyzers/ImageAnalyzer';
import { ClaudeAnalyzer } from '../analyzers/ClaudeAnalyzer';
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
      throw new Error('No analyzer configured. Call setAnalysisFunction() or setClaudeAnalyzer() first.');
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
   * Configurar Claude como analizador directo
   * @param apiKey - API Key de Claude
   */
  setClaudeAnalyzer(apiKey: string): void {
    const claudeAnalyzer = new ClaudeAnalyzer(apiKey);
    this.moderator.setAnalyzer(claudeAnalyzer);
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
