export type VerificationStatus = 'pending' | 'processing' | 'verified' | 'rejected' | 'flagged';

export interface IdentityData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  expiryDate?: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface AgentLogEntry {
  id: string;
  agentName: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface VerificationResult {
  id: string;
  status: VerificationStatus;
  identityData?: IdentityData;
  riskScore: number; // 0-100
  logs: AgentLogEntry[];
  proofHash?: string;
}
