export enum GitLabObjectKind {
  Push = "push",
  MergeRequest = "merge_request",
  Issue = "issue",
  Pipeline = "pipeline",
  Note = "note",
  TagPush = "tag_push",
}

export enum GitLabEventName {
  Push = "push",
  MergeRequest = "merge_request",
  Issue = "issue",
  Pipeline = "pipeline",
  Note = "note",
  TagPush = "tag_push",
}

export interface GitLabEvent {
  object_kind: GitLabObjectKind;
  event_name: GitLabEventName;
  project: {
    id: number;
    name: string;
    description: string;
    web_url: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    path_with_namespace: string;
    default_branch: string;
    ci_config_path: string;
  };
}

export interface GitLabPushEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.Push;
  event_name: GitLabEventName.Push;
  ref: string;
  before: string;
  after: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
    git_http_url: string;
    git_ssh_url: string;
    visibility_level: number;
  };
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
    added: string[];
    modified: string[];
    removed: string[];
  }>;
  total_commits_count: number;
}

export interface GitLabMergeRequestEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.MergeRequest;
  event_name: GitLabEventName.MergeRequest;
  user: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
  object_attributes: {
    id: number;
    target_branch: string;
    source_branch: string;
    source_project_id: number;
    target_project_id: number;
    title: string;
    state: string;
    merge_status: string;
    url: string;
    action: string;
  };
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
  };
}

export interface GitLabIssueEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.Issue;
  event_name: GitLabEventName.Issue;
  user: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
  object_attributes: {
    id: number;
    title: string;
    description: string;
    state: string;
    created_at: string;
    updated_at: string;
    due_date: string;
    url: string;
    action: string;
  };
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
  };
  changes: any;
}

export interface GitLabPipelineEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.Pipeline;
  event_name: GitLabEventName.Pipeline;
  user: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
  object_attributes: {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    status: string;
    stages: string[];
    created_at: string;
    finished_at: string;
    duration: number;
  };
  builds: any[];
}

export interface GitLabNoteEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.Note;
  event_name: GitLabEventName.Note;
  user: {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
  };
  project_id: number;
  object_attributes: {
    id: number;
    note: string;
    noteable_type: string;
    author_id: number;
    created_at: string;
    updated_at: string;
  };
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
  };
}

export interface GitLabTagPushEvent extends GitLabEvent {
  object_kind: GitLabObjectKind.TagPush;
  event_name: GitLabEventName.TagPush;
  ref: string;
  before: string;
  after: string;
  user_id: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
    git_http_url: string;
    git_ssh_url: string;
    visibility_level: number;
  };
  commits: Array<{
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
      name: string;
      email: string;
    };
    added: string[];
    modified: string[];
    removed: string[];
  }>;
  total_commits_count: number;
}
