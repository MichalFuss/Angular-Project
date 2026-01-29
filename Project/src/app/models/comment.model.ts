export class CommentModel {
    id: number;
    task_id: number;
    user_id: number;
    body: string;
    created_at: Date;
    author_name: string
} 
export class PostCommentModel {
    taskId: number;
    body: string;
}