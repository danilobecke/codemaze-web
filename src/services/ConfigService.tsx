import { Config } from "../models/Config";
import { get, v1Namespace } from "./ApiService";

var ConfigService = (function () {
    const configsKey = 'app_configs'
    const storage = sessionStorage

    async function getConfigs(): Promise<Config> {
        const cached = getOnStorage()
        if (cached) {
            return Promise.resolve(cached)
        }
        return fetchConfigs()
    }

    function getOnStorage(): Config | null {
        const rawConfigs = storage.getItem(configsKey)
        if (!rawConfigs) {
            return  null
        }
        const configs = fromRawValue(rawConfigs)
        if (!configs) {
            storage.removeItem(configsKey)
        }
        return configs
    }

    async function fetchConfigs(): Promise<Config> {
        return get(v1Namespace('configs'), Config, () => {}, false)
            .then(config => setOnStorage(config))
    }

    function fromRawValue(rawConfigs: string): Config | null {
        const jsonConfig = JSON.parse(rawConfigs)
        const config = new Config()
        if (!config.isValid(jsonConfig)) {
            return null
        }
        return Object.assign(config, jsonConfig)
    }

    function setOnStorage(config: Config): Config {
        storage.setItem(configsKey, JSON.stringify(config))
        return config
    }

    return {
        getConfigs: getConfigs
    }
})();

export default ConfigService;
