const key = "bratwurst-scoreboard";

const hasStorage = () => {
	return typeof(Storage) !== "undefined";
}

export const getBoardState = () => {
	let data = null;
	if (hasStorage()) {
        const json = localStorage.getItem(key);
        if (json) {
          data = JSON.parse(json);
        }
    }
    return data;
}

export const setBoardState = (board) => {
	if (hasStorage()) {
        localStorage.setItem(key, JSON.stringify(board));
    }
}

export const removeBoardState = () => {
	if (hasStorage()) {
		localStorage.removeItem(key);
	}
}





