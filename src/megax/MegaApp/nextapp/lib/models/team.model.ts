export type Team = {
  id: number;
  name: string;
  members: TeamMember[];
};

export type TeamMember = {
  teamId: number;
  memberId: number;
  memberName?: string;
  leader: boolean;
};

export enum TeamQueryInclude {
  Leader = 0,
  Member = 1,
}
