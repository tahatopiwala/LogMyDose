import { AccountSection } from "@/components/settings/AccountSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { ProfilePictureSection } from "@/components/settings/ProfilePictureSection";
import { SubscriptionSection } from "@/components/settings/SubscriptionSection";
import { DataExportSection } from "@/components/settings/DataExportSection";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      {/* Account Information */}
      <AccountSection />

      {/* Security */}
      <SecuritySection />

      {/* Profile Picture */}
      <ProfilePictureSection />

      {/* Subscription */}
      <SubscriptionSection />

      {/* Data Export */}
      <DataExportSection />

      {/* Danger Zone */}
      <DangerZoneSection />
    </div>
  );
}
