/**
 * Security Service for audit logging and security monitoring
 */

import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
}

class SecurityService {
  /**
   * Log a security event for audit purposes
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('⚠️ [Security] Attempted to log security event without authenticated user');
        return;
      }

      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_action: event.action,
        p_resource_type: event.resourceType || null,
        p_resource_id: event.resourceId || null
      });

      console.log(`🔒 [Security] Event logged: ${event.action}`, {
        resourceType: event.resourceType,
        resourceId: event.resourceId
      });
    } catch (error) {
      console.error('❌ [Security] Failed to log security event:', error);
    }
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(action: 'login' | 'logout' | 'signup' | 'password_reset' | 'token_refresh'): Promise<void> {
    await this.logSecurityEvent({
      action: `auth.${action}`,
      resourceType: 'authentication'
    });
  }

  /**
   * Log OAuth token access
   */
  async logOAuthTokenAccess(provider: string, action: 'read' | 'write' | 'refresh' | 'revoke'): Promise<void> {
    await this.logSecurityEvent({
      action: `oauth.token.${action}`,
      resourceType: 'oauth_token',
      resourceId: provider
    });
  }

  /**
   * Log data access events
   */
  async logDataAccess(resourceType: string, resourceId: string, action: 'read' | 'write' | 'delete'): Promise<void> {
    await this.logSecurityEvent({
      action: `data.${action}`,
      resourceType,
      resourceId
    });
  }

  /**
   * Log exercise generation events for rate limiting monitoring
   */
  async logExerciseGeneration(exerciseId: string, mode: string): Promise<void> {
    await this.logSecurityEvent({
      action: 'exercise.generate',
      resourceType: 'exercise',
      resourceId: exerciseId,
      details: { mode }
    });
  }

  /**
   * Get user's security audit log
   */
  async getUserAuditLog(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('❌ [Security] Failed to get user audit log:', error);
      return [];
    }
  }
}

export const securityService = new SecurityService();