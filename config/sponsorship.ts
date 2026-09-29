export const SPONSORSHIP_CONTACT = {
  telegramUsername: 'OssamaHashim',
  telegramUrl: 'https://t.me/OssamaHashim',
  email: 'ossama.hashim.m@gmail.com',
  emailUrl: 'mailto:ossama.hashim.m@gmail.com',
} as const;

export type SponsorSlotId =
  | 'homepage-top'
  | 'homepage-bottom'
  | 'category-top'
  | 'product-sidebar'
  | 'article-middle'
  | 'article-bottom';

export type SponsorCampaign = {
  id: string;
  slot: SponsorSlotId;
  status: 'active' | 'paused';
  advertiserName: string;
  title: string;
  description?: string;
  image?: string;
  href: string;
  startDate: string;
  endDate: string;
};

export const sponsorCampaigns: SponsorCampaign[] = [];

export function getActiveSponsor(
  slot: SponsorSlotId,
  now = new Date(),
): SponsorCampaign | null {
  const timestamp = now.getTime();

  return (
    sponsorCampaigns.find((campaign) => {
      if (campaign.slot !== slot || campaign.status !== 'active') return false;

      const start = new Date(campaign.startDate).getTime();
      const end = new Date(campaign.endDate).getTime();

      return (
        Number.isFinite(start) &&
        Number.isFinite(end) &&
        start <= timestamp &&
        timestamp <= end
      );
    }) ?? null
  );
}
