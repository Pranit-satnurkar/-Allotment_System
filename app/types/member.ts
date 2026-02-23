export type Member = {
    id: string;
    name: string;
    currentChapter: number;
};

export type Group = {
    id: string;
    name: string;
    members: Member[];
};
