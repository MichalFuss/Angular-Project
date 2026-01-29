export class TeamsModel {
  id: string;
  name: string;
  created_at: Date;
  members_count: number;
};
export class postTeamMemberModel {
  userId: string;
  teamId: string;
}