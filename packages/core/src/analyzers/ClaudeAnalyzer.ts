import { BaseImageAnalyzer } from './ImageAnalyzer';
import { ModerationOptions, ModerationCategory } from '../types';
import { AdModeratorClient } from '../core/client';
import { AdMediaType } from '../core/types';

export class ClaudeAnalyzer extends BaseImageAnalyzer {
  private client: AdModeratorClient;
  
  constructor(apiKey: string) {
    super('claude-analyzer', '1.0.0');
    this.client = new AdModeratorClient(apiKey);
  }

  async analyze(imageBuffer: Buffer, imageType: string, options: ModerationOptions): Promise<ModerationCategory[]> {
    try {
      // Usar el código de tu amigo
      const adStatus = await this.client.getAdStatus(imageBuffer, 'digital' as AdMediaType);
      
      if (!adStatus) {
        return [{
          name: 'analysis_error',
          confidence: 1.0,
          severity: 'medium'
        }];
      }

      // Si no es compliant, devolver las razones como categorías
      if (!adStatus.isAdCompliant && adStatus.negativeReasons) {
        return adStatus.negativeReasons.map(reason => ({
          name: reason.toLowerCase().replace(/\s+/g, '_'),
          confidence: 0.9,
          severity: 'high' as const
        }));
      }

      // Si es compliant, devolver array vacío
      return [];
      
    } catch (error) {
      console.error('Error en ClaudeAnalyzer:', error);
      return [{
        name: 'analysis_error',
        confidence: 1.0,
        severity: 'medium'
      }];
    }
  }
}
