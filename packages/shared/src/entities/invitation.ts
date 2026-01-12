/**
 * ClinicInvitation entity
 * Maps to: clinic_invitations table
 */
export interface ClinicInvitation {
  id: string;
  clinicId: string;
  email: string;
  inviteCode: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
}

/**
 * Invitation with clinic relation
 */
export interface InvitationWithClinic extends ClinicInvitation {
  clinic: {
    name: string;
  };
}
