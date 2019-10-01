import {ScriptEntity} from './script-entity';

export class Transcription {
    content : ScriptEntity[] = [];
    keywords: string[] = [];
    currentEntity : number = 0;
}