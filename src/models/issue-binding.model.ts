import * as mongoose from "mongoose";
import {Document, model, Model} from "mongoose";

interface IssueBindingMethods {
}
export interface IssueBindingDocument extends IssueBindingDto, Document, IssueBindingMethods {
}

export type IssueBindingModel = Model<IssueBindingDto, IssueBindingDocument, IssueBindingMethods>;

const schema = new mongoose.Schema<IssueBindingDto>({
  issueId: String,
  threadId: String,
  issue: Object,
  thread: Object,
  isClosed: {
    type: Boolean,
    default: false
  }
});

export const IssueBinding = model<IssueBindingDto, IssueBindingModel>('IssueBinding', schema);
