export const SUI_NETWORK = "mainnet";
export const EXPLORER_ENV_URLS = {
    devnet: "https://devnet.suivision.xyz",
    testnet: "https://testnet.suivision.xyz",
    mainnet: "https://suivision.xyz",
};
export const EXPLORER_URL = EXPLORER_ENV_URLS[SUI_NETWORK];
export const SRM_SUPERCHAT = -1002280961077;
export const TKI_SUPERCHAT = -1002455619166;
export const WAGMI_SUPERCHAT = -1002668367834;
export const OTC_SUPERCHAT = -1002816346750;
export const CFUT_SUPERCHAT = -1002798255759;
export const KODUCK_SUPERCHAT = -1002541653633;
export const SEP_SUPERCHAT = -1002811572676;
export const BOT_DEVELOPER = 6040057955; //pumpa
export const TEST_GROUP_CHAT_ID = -1002330645668; // Fedee Test Group
export const TEST_VIDEO_ID = "BAACAgEAAyEFAASK6tSkAAJdXGhTv-H8LFY_mnQKSFfi21ns7AUsAALJBgACDvWhRk4g4yFqtR-iNgQ"; //replace with your test video id

export const ME_BOT_USERNAME = 'SrmSuiBot';


export type Network = "mainnet" | "testnet" | "devnet" | "localnet";

export const CONFIG = {
  /// Look for events every 1s
  POLLING_INTERVAL_MS: 1000 * 8,
  DEFAULT_LIMIT: 50,
  NETWORK: SUI_NETWORK as Network,
  PACKAGE_ID:
    "0x05f51d02fa049194239ffeac3e446a0020e7bbfc5d9149ff888366c24b2456b1",
  MODULE_NAME: "SRMV1",
  FUNCTION_NAME: "swap_a_for_b_with_coins_and_transfer_to_sender",
  COIN_A_TYPE:
    "0x05f51d02fa049194239ffeac3e446a0020e7bbfc5d9149ff888366c24b2456b1",
  COIN_B_TYPE:
    "0x05f51d02fa049194239ffeac3e446a0020e7bbfc5d9149ff888366c24b2456b1",
  coins: [
    {
      coinType:
        "0xbd2301d12b96dd64b41134168931dd54742c0336bcf1752ed346a177ac00d1ed::SuiRewardsMe::SUIREWARDSME",
      poolId:
        "0xbad96d82f84d3fa3b31d49054e277eed973347382835b479622f277641abc693",
      name: "Sui Rewards Me",
      symbol: "SRM",
      decimals: 9,
      supply: 1_000_000_000_000_000_000,
      emoji: "🪐💎",
      video:
        "BAACAgEAAxkBAAMKaCyk490G6Xs17QMTELU7YtWAwYYAAiEEAAKwZ2BFO04xhtDfGKU2BA",
      chat: SRM_SUPERCHAT,
      socials: {
        telegram: "https://t.me/suirewardsme",
        x: "https://x.com/SuiRewardsMe",
        discord: "https://discord.gg/suirewardsme",
        website: "https://suirewards.me",
        dapp: "https://app.suirewards.me",
        buy: "https://app.suirewards.me/swap/SUI/SRM",
      },
    },
    {
      coinType:
        "0x983fe8c1ced6003c42908a2942c63dd5e42f001c0a58717666a5bbffef469a54::tki::TKI",
      poolId:
        "0xc9c19552264b754bd5bf4d173ed97b2c0fd4d8a0c0c86a203bbc8b9a14c901b2",
      name: "Tokifi",
      symbol: "TKI",
      decimals: 9,
      supply: 7_777_777_000_000_000,
      emoji: "⛩⛩",
      video:
        "BAACAgEAAyEFAASbSDLXAAIYHmg6c9ueuy6nR6jg1kZ-ebaFm8aYAAKGBgACp5jZRbyTAfKVHPt3NgQ",
      chat: TKI_SUPERCHAT,
      socials: {
        telegram: "https://t.me/+2g_zdkkymvE5YzUx",
        x: "https://x.com/TokifiOnSUI",
        discord: "https://discord.gg/QyVeUDtK",
        website: "https://tokifitoken.com/",
        buy: "https://app.suirewards.me/swap/SUI/TKI",
      },
    },
    {
      coinType:
        "0x1ef589de086af858d0d6bd690b971eb4fdfb658d728d063e4e264a97ea1799f6::wagmi::WAGMI",
      poolId:
        "0x7c82f69c879d2160c5b5d7f09d731b04e46324a9500ed1e023768713c8ceb03e",
      name: "We All Gonna Make It",
      symbol: "WAGMI",
      decimals: 6,
      supply: 10_000_000_000_000_000,
      emoji: "🤡",
      video:
        "BAACAgEAAyEFAASbSDLXAAIYPWg6hJY3-n4lZr7Dd1BNOxR7dkUtAAIyBQACVwHRRZIP8DkXq_dsNgQ",
      chat: WAGMI_SUPERCHAT,
      socials: {
        telegram: "https://t.co/w6Hb5Z1yaH",
        x: "https://x.com/WagmiSui_",
        website: "https://www.wagmisui.com/",
        buy: "https://app.suirewards.me/swap/SUI/WAGMI",
      },
    },
    {
      coinType:
        "0xa9a4c699ea65b677b2eed8662ae4799676b93490584dbfa920cebe35ebf61059::otc::OTC",
      poolId:
        "0xec820f6ef6f4861824d08f7477f804ea769eacc64fed50575a5351f286643db8",
      name: "Over The Counter",
      symbol: "OTC",
      decimals: 9,
      supply: 1_000_000_000_000_000_000,
      emoji: "💱",
      video:
        "BAACAgEAAxkBAAMnaEeyG-SnPfbXtcVb5GzJdg4xBcQAAi0FAAK5fDhGVksjfbnLlD02BA",
      chat: OTC_SUPERCHAT,
      socials: {
        telegram: "https://t.me/OTConSUI",
        website: "https://linktr.ee/OTConSui",
        buy: "https://app.suirewards.me/swap/SUI/OTC",
      },
    },
    {
      coinType:
        "0xa543c3268b80c5c27ba705fdb99d01d737aafbf6205ffbef2994bd284b39d90b::CAPTAINFUTURUS::CAPTAINFUTURUS",
      poolId:
        "0xb8a728ba58e241cabb4df1d14b5fe1076a658635223f413013981f9bc9640cce",
      name: "Captain Futurus Utility Token",
      symbol: "CFUT",
      decimals: 9,
      supply: 1_000_000_000_000_000_000,
      emoji: "⏳🪐⛴️💎",
      video:
        "BAACAgEAAyEFAASW4Pf5AAINBGhNowH2TNE5Yy-UP50CmObmgiO3AAKvBQACA2JpRoH8HVM3RlLBNgQ",
      chat: CFUT_SUPERCHAT,
      socials: {
        telegram: "https://t.me/+n8Lkccxhz-NkZDU0",
        x: "https://x.com/FuturusDaoLtd",
        discord: "https://discord.gg/NyDks6cB",
        website: "https://linktr.ee/futurusdao",
        dapp: "https://app.suirewards.me",
        buy: "https://app.suirewards.me/swap/SUI/CFUT",
      },
    },
    {
      coinType:
        "0x6fee0f4d3e36392531550e1afd2bd879b1326959b2d4870eb7ccea9c69bc144f::koduck::KODUCK",
      poolId:
        "0x2e3c0547a5365896f769a5b8f59dbae3ebf42824515272abb74feb0180f8be0f",
      name: "Koduck On Sui",
      symbol: "KODUCK",
      decimals: 6,
      supply: 10_000_000_000_000_000,
      emoji: "🌊",
      video:
        "CgACAgEAAxkBAAMyaFBXhfrdsePHWLO9X0CBbRlmcHkAAgYGAAIZZIFG9TLPktGmMcg2BA",
      chat: KODUCK_SUPERCHAT,
      socials: {
        telegram: "https://t.me/+v19NyscXdOUwNDZl",
        x: "https://x.com/koducktheduck",
        website: "https://koduck.org/",
        buy: "https://app.suirewards.me/swap/SUI/KODUCK",
      },
    },
    {
      coinType: '0xe82075a4f218209bd56c4ad0ed35dd4de7b73c803340d97750ace7b832fd3f3b::SEP::SEP',
      poolId: '0x41e8c828bc735d1332f793169ed7ad22ff504378bf7944ccf9fb5acb12a391e6',
      name: 'Sui Eater Protocol',
      symbol: 'SEP',
      decimals: 9,
      supply: 1_000_000_000_000_000_000,
      emoji: '😈🕳',
      video: 'CgACAgEAAyEFAASW4Pf5AAIN3WhQ-ptY_YxufUFxNu-RZbnUWQ7-AAKaBAACuByIRirR6p4Sk9_SNgQ',
      chat: SEP_SUPERCHAT,
      socials: {
        telegram: 'https://t.me/+8xppPdpiTOhkMGQx',
        x: 'https://x.com/suieaterrewards?s=21',
        discord: 'https://discord.gg/suirewardsme',
        website: 'https://suirewards.me',
        dapp: 'https://app.suirewards.me',
        buy: 'https://app.suirewards.me/swap/SUI/SEP',
      }
    },
    // { // suitrump config
    //   coinType: '0xe82075a4f218209bd56c4ad0ed35dd4de7b73c803340d97750ace7b832fd3f3b::SEP::SEP',
    //   poolId: '0x41e8c828bc735d1332f793169ed7ad22ff504378bf7944ccf9fb5acb12a391e6',
    //   name: 'Sui Eater Protocol',
    //   symbol: 'SEP',
    //   decimals: 9,
    //   supply: 1_000_000_000_000_000_000,
    //   emoji: '😈🕳',
    //   video: 'CgACAgEAAyEFAASW4Pf5AAIN3WhQ-ptY_YxufUFxNu-RZbnUWQ7-AAKaBAACuByIRirR6p4Sk9_SNgQ',
    //   chat: SEP_SUPERCHAT,
    //   socials: {
    //     telegram: 'https://t.me/+8xppPdpiTOhkMGQx',
    //     x: 'https://x.com/suieaterrewards?s=21',
    //     discord: 'https://discord.gg/suirewardsme',
    //     website: 'https://suirewards.me',
    //     dapp: 'https://app.suirewards.me',
    //     buy: 'https://app.suirewards.me/swap/SUI/SEP',
    //   }
    // },
  ],
};