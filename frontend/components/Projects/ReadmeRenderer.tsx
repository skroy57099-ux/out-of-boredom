import { Project } from "./types";

import YoloContent from "./content/yolov8";
import BlinkitContent from "./content/blinkit";

type Props = {
  project: Project;
};

export default function ReadmeRenderer({ project }: Props) {
  switch (project.id) {
    case "yolov8":
      return <YoloContent project={project} />;

    case "blinkit":
      return <BlinkitContent project={project} />;

    default:
      return null;
  }
}