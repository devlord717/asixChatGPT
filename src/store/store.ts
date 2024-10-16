import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { PromptSlice, createPromptSlice } from './prompt-slice';
import { ToastSlice, createToastSlice } from './toast-slice';
import {
  ChatInterface,
  LocalStorageInterfaceV0ToV1,
  LocalStorageInterfaceV1ToV2,
  LocalStorageInterfaceV2ToV3,
  LocalStorageInterfaceV3ToV4,
  LocalStorageInterfaceV4ToV5,
  LocalStorageInterfaceV5ToV6,
  LocalStorageInterfaceV6ToV7,
  LocalStorageInterfaceV7oV8,
} from '@type/chat';
import {
  migrateV0,
  migrateV1,
  migrateV2,
  migrateV3,
  migrateV4,
  migrateV5,
  migrateV6,
  migrateV7,
} from './migrate';
import { Theme } from '@type/theme';

export type StoreState = {
  chats: ChatInterface[]; // Ensure this is required
  currentChatIndex: number;
  apiKey?: string; // Optional
  apiEndpoint: string;
  theme: Theme;
  autoTitle: boolean;
  advancedMode: boolean;
  prompts: any[]; // Specify types
  defaultChatConfig: any; // Specify types
  defaultSystemMessage: string;
  hideMenuOptions: boolean;
  firstVisit: boolean;
  hideSideMenu: boolean;
  folders: any[]; // Specify types
  enterToSubmit: boolean;
  inlineLatex: boolean;
  markdownMode: boolean;
  totalTokenUsed: number;
  countTotalTokens: boolean;
};

export const createPartializedState = (state: StoreState) => ({
  chats: state.chats,
  currentChatIndex: state.currentChatIndex,
  apiKey: state.apiKey,
  apiEndpoint: state.apiEndpoint,
  theme: state.theme,
  autoTitle: state.autoTitle,
  advancedMode: state.advancedMode,
  prompts: state.prompts,
  defaultChatConfig: state.defaultChatConfig,
  defaultSystemMessage: state.defaultSystemMessage,
  hideMenuOptions: state.hideMenuOptions,
  firstVisit: state.firstVisit,
  hideSideMenu: state.hideSideMenu,
  folders: state.folders,
  enterToSubmit: state.enterToSubmit,
  inlineLatex: state.inlineLatex,
  markdownMode: state.markdownMode,
  totalTokenUsed: state.totalTokenUsed,
  countTotalTokens: state.countTotalTokens,
});

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createChatSlice(set, get),
      ...createInputSlice(set, get),
      ...createAuthSlice(set, get),
      ...createConfigSlice(set, get),
      ...createPromptSlice(set, get),
      ...createToastSlice(set, get),
    }),
    {
      name: 'free-chat-gpt',
      partialize: (state) => createPartializedState(state),
      version: 8,
      migrate: (persistedState, version) => {
        switch (version) {
          case 0:
            migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
            break;
          case 1:
            migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
            break;
          case 2:
            migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
            break;
          case 3:
            migrateV3(persistedState as LocalStorageInterfaceV3ToV4);
            break;
          case 4:
            migrateV4(persistedState as LocalStorageInterfaceV4ToV5);
            break;
          case 5:
            migrateV5(persistedState as LocalStorageInterfaceV5ToV6);
            break;
          case 6:
            migrateV6(persistedState as LocalStorageInterfaceV6ToV7);
            break;
          case 7:
            migrateV7(persistedState as LocalStorageInterfaceV7oV8);
            break;
          default:
            return {
              chats: [], // Ensure this matches expected shape
              currentChatIndex: 0,
              apiKey: undefined,
              apiEndpoint: '',
              theme: 'default',
              autoTitle: false,
              advancedMode: false,
              prompts: [],
              defaultChatConfig: {},
              defaultSystemMessage: '',
              hideMenuOptions: false,
              firstVisit: true,
              hideSideMenu: false,
              folders: [],
              enterToSubmit: false,
              inlineLatex: false,
              markdownMode: false,
              totalTokenUsed: 0,
              countTotalTokens: false,
            } as unknown as StoreState; // Ensure this is complete
        }

        return persistedState as StoreState; // Ensure this is a complete and valid StoreState
      },
    }
  )
);

export default useStore;
