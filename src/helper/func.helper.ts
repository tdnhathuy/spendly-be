import path from "path";

export const makeDir = (dir: string) => {
	return path.join(__dirname, "..", dir);
};
