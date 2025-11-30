import { LanguageModel } from 'ai';
import { AIModelConfig } from './ai-config.interface';

/**
 * Interfaz Strategy para proveedores de modelos de IA.
 * Cada proveedor implementa esta interfaz para crear modelos con su configuración específica.
 */
export interface IModelProviderStrategy {
  /**
   * Crea un modelo de lenguaje con la configuración aplicada.
   * @param modelId - Identificador del modelo específico del proveedor
   * @param config - Configuración unificada que se mapeará a opciones del proveedor
   * @returns Modelo de lenguaje configurado y listo para usar
   */
  createModel(modelId: string, config?: AIModelConfig): LanguageModel;

  /**
   * Obtiene las opciones específicas del proveedor mapeadas desde la configuración unificada.
   * @param config - Configuración unificada
   * @returns Opciones específicas del proveedor
   */
  mapConfigToProviderOptions(config?: AIModelConfig): Record<string, any>;
}
