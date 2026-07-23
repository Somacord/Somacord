import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { InterestsEditor } from "@/components/profile/interests-editor";
import { NotificationSettingsForm } from "@/components/profile/notification-settings-form";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";
import { requireOnboarded } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

/** Member profile — docs/website/sitemap.md's `/profile`. */
export default async function ProfilePage() {
  const { user, profile } = await requireOnboarded();

  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="mb-10">
          <Eyebrow>Your Account</Eyebrow>
          <h1 className="text-[32px]">Profile</h1>
        </div>

        <div className="space-y-8">
          <Panel>
            <h2 className="mb-4 text-lg">Photo</h2>
            <AvatarUploader userId={user.id} initialAvatarUrl={profile.avatarUrl} />
          </Panel>

          <Panel>
            <h2 className="mb-4 text-lg">Profile info</h2>
            <ProfileInfoForm name={user.name ?? ""} city={user.city ?? ""} />
          </Panel>

          <Panel>
            <h2 className="mb-1 text-lg">Interests</h2>
            <p className="text-ink-muted mb-4 text-sm">
              Used to recommend gatherings on your dashboard.
            </p>
            <InterestsEditor initialInterests={profile.interests} />
          </Panel>

          <Panel>
            <h2 className="mb-1 text-lg">Notification settings</h2>
            <p className="text-ink-muted mb-2 text-sm">Choose what Somacord emails you about.</p>
            <NotificationSettingsForm preferences={profile.notificationPreferences} />
          </Panel>
        </div>
      </Container>
    </Section>
  );
}
