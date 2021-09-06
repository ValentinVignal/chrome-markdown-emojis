export type Message = {
	type: MessageTypes;
	text: string;

}


export enum MessageTypes {
	ParseFullEmoji,
	PartialEmoji,
}

export type ParseFullEmojiResponse = {
	key?: string;
	emoji?: string;
}

export type PartialEmojiResponse = {
	key?: string;
	emojis?: {
		[key: string]: string,
	};
}