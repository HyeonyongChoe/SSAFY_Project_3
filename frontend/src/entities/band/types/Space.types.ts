export interface SpacePreDto {
  space_id: number;
  space_name: string;
  img_url: string;
  space_type: "PERSONAL" | "TEAM";
}

export interface SpaceDetailDto {
  spaceId: number;
  spaceName: string;
  description: string;
  imageUrl: string | null;
  spaceType: "PERSONAL" | "TEAM";
  createAt: string;
  updateAt: string | null;
  roleType: "OWNER" | "MEMBER";
  members: MemberDto[];
}

export interface MemberDto {
  nickName: string;
  profileImageUrl: string;
}
