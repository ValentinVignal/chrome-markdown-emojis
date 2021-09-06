export type Message = {
	type: MessageTypes;
	text: string;

}


export enum MessageTypes {
	ParseFullEmoji,
}

export type ParseFullEmojiResponse = {
	key?: string;
	emoji?: string;
}