export class getProjectModel { 
    id: number; 
    team_id: number; 
    name: string; 
    description: string; 
    status: string; 
    created_at: Date
 }
 export class createProjectModel {
    teamId: number;
    name: string;
    description: string;
 }