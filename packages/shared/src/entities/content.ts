/**
 * Content entity - Educational content
 * Maps to: content table
 */
export interface Content {
  id: string;
  type: string;
  title: string;
  description: string | null;
  contentUrl: string | null;
  contentBody: string | null;
  thumbnailUrl: string | null;
  tags: string[];
  categoryIds: string[];
  substanceIds: string[];
  isGlobal: boolean;
  tenantIds: string[];
  isPublished: boolean;
  createdAt: Date;
}
