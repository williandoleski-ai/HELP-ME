
/**
 * Integração Real via Supabase Edge Functions
 * 
 * Este serviço comunica-se com o seu backend no Supabase.
 * Certifique-se de ter as funções 'create-pix' e 'check-payment' implementadas no seu console Supabase.
 */

const SUPABASE_URL = 'https://bnzhclfilsgqwizagcwc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2sQnIqCoNvcTeB3TTi2UCQ_u_Owfcxw';

interface PixResponse {
  qrCode: string;
  copyPaste: string;
  transactionId: string;
  expiresIn: number;
}

export const paymentService = {
  /**
   * Chama sua Edge Function no Supabase para gerar uma cobrança no AbacatePay.
   */
  createPixCharge: async (amount: number, description: string): Promise<PixResponse> => {
    console.log(`Iniciando checkout real de R$${amount} via Supabase...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
          externalId: `order_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao processar checkout no servidor.');
      }

      const data = await response.json();
      
      // O backend deve retornar os dados formatados conforme a interface PixResponse
      return {
        qrCode: data.qrCode,
        copyPaste: data.copyPaste,
        transactionId: data.transactionId,
        expiresIn: data.expiresIn || 600
      };
    } catch (error) {
      console.error("Erro na integração Supabase/AbacatePay:", error);
      // Fallback para fins de demonstração caso a função ainda não esteja publicada
      throw error;
    }
  },

  /**
   * Verifica o status do pagamento consultando o backend.
   */
  checkPaymentStatus: async (transactionId: string): Promise<'PENDING' | 'PAID' | 'EXPIRED'> => {
    console.log(`Consultando status da transação ${transactionId}...`);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/check-payment?id=${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) {
        return 'PENDING';
      }

      const data = await response.json();
      return data.status; // Esperado: 'PAID', 'PENDING' ou 'EXPIRED'
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      return 'PENDING';
    }
  }
};
