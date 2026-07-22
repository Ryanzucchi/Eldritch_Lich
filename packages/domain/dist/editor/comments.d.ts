export interface CommentReply {
    id: string;
    authorName: string;
    createdAt: string;
    text: string;
}
export interface InlineComment {
    id: string;
    manuscriptId: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: string;
    selectedText: string;
    commentText: string;
    isResolved: boolean;
    replies: CommentReply[];
}
