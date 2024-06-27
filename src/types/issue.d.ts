interface IssueBindingDto {
  issueId: string;
  threadId: string;
  issue?: object;
  thread?: object;
  isClosed: boolean;
}
