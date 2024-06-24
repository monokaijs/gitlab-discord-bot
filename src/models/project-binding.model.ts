import * as mongoose from "mongoose";
import {Document, model, Model} from "mongoose";

interface ProjectBindingMethods {
}
export interface ProjectBindingDocument extends ProjectBindingDto, Document, ProjectBindingMethods {
}

export type ProjectBindingModel = Model<ProjectBindingDto, ProjectBindingDocument, ProjectBindingMethods>;

const schema = new mongoose.Schema<ProjectBindingDto>({
  gitlabId: {
    type: String,
  },
  chatId: {
    type: String,
  }
});

export const ProjectBinding = model<ProjectBindingDto, ProjectBindingModel>('ProjectBinding', schema);
