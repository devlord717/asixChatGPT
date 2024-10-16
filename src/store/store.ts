import { StoreApi, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSlice, createChatSlice } from './chat-slice';
import { InputSlice, createInputSlice } from './input-slice';
import { AuthSlice, createAuthSlice } from './auth-slice';
import { ConfigSlice, createConfigSlice } from './config-slice';
import { PromptSlice, createPromptSlice } from './prompt-slice';
import { ToastSlice, createToastSlice } from './toast-slice';
import {
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

export type StoreState = ChatSlice & 
  InputSlice & 
  AuthSlice & 
  ConfigSlice & 
  PromptSlice & 
  ToastSlice;

export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState']
) => T;

const createPartializedState = (state: StoreState): Partial<StoreState> => ({
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
  messages: state.messages,
  generating: state.generating,
  error: state.error,
  setMessages: state.setMessages,
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
      partialize: createPartializedState,
      version: 8,
      migrate: (persistedState: any, version: number): StoreState => {
        let migratedState = persistedState;

        switch (version) {
          case 0:
            migratedState = migrateV0(persistedState as LocalStorageInterfaceV0ToV1);
            break;
          case 1:
            migratedState = migrateV1(persistedState as LocalStorageInterfaceV1ToV2);
            break;
          case 2:
            migratedState = migrateV2(persistedState as LocalStorageInterfaceV2ToV3);
            break;
          case 3:
            migratedState = migrateV3(persistedState as LocalStorageInterfaceV3ToV4);
            break;
          case 4:
            migratedState = migrateV4(persistedState as LocalStorageInterfaceV4ToV5);
            break;
          case 5:
            migratedState = migrateV5(persistedState as LocalStorageInterfaceV5ToV6);
            break;
          case 6:
            migratedState = migrateV6(persistedState as LocalStorageInterfaceV6ToV7);
            break;
          case 7:
            migratedState = migrateV7(persistedState as LocalStorageInterfaceV7oV8);
            break;
        }

        // Ensure the returned object has all required properties
        return {
          chats: [],
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
          messages: [],
          generating: false,
          error: null,
          setMessages: (messages: any[]) => set({ messages }), // Ensure 'set' is properly passed
          ...migratedState,
        } as StoreState;
      },
    }
  )
);

export default useStore;
