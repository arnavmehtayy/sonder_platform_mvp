import { experience_type, data_type } from "../init_datasets";
import { experience_regression, data_regression} from "./RidgeRegression";
import Validation_test from "../Validation_test";

export const experiences: experience_type[] = [experience_regression];
export const initDataSets: { default: data_type, [key: string]: data_type } = {default: {
    title: "Question default",
    order: [{ type: "question", id: 0 }],
    questions: ["This is default", "This"],
    validations: [new Validation_test()],
    influencesData: [],
    controlData: [],
    canvasData: [],
    scoreData: [],
    placement: null,
  } , ...data_regression }