interface Pipeline {
  id: number;
  projectId: string;
  projectName: string;
  projectUrl: string;
  author: string;
  jobs: Job[];
  status: string;
  logString: string;
  finished: boolean;
}

interface Job {
  id: number;
  stage: string[];
  name: string;
  pipelineId: string;
  finished: boolean;
  status: string;
  duration: number;
  logString: string;
}

class CiService {
  pipelines: {
    [pipelineId: number]: Pipeline,
  } = {};


}

export default new CiService();
