import { AppError } from "../models/AppError";
import { Config } from "../models/Config";
import { getArray, v1Namespace } from "./ApiService";

var ConfigService = (function () {
    const configsKey = 'app_configs'
    const jsonKey = 'configs'

    const storage = sessionStorage

    async function getConfigs(): Promise<Config[]> {
        const cached = getOnStorage()
        if (cached) {
            return Promise.resolve(cached)
        }
        return fetchConfigs()
    }

    function getOnStorage(): Config[] | null {
        const rawConfigs = storage.getItem(configsKey)
        if (!rawConfigs) {
            return  null
        }
        return fromRawValue(rawConfigs)
    }

    async function fetchConfigs(): Promise<Config[]> {
        return getArray(v1Namespace('configs'), jsonKey, Config, (_) => {}, false)
            .then(configs => setOnStorage(configs))
    }

    function fromRawValue(rawConfigs: string): Config[] | null {
        const json = JSON.parse(rawConfigs)
        let result: Config[] = []
        for (const config of json[jsonKey]) {
            try {
                result.push(parse(config))
            } catch {
                return null
            }
        }
        return result
    }

    function setOnStorage(configs: Config[]): Config[] {
        const obj = {
            [jsonKey]: configs
        }
        storage.setItem(configsKey, JSON.stringify(obj))
        return configs
    }

    function parse(configJSON: any): Config {
        const config = new Config()
        if (!config.isValid(configJSON)) {
            throw new AppError('', 'Invalid Config JSON.')
        }
        return Object.assign(config, configJSON)
    }

    return {
        getConfigs: getConfigs
    }
})();

export default ConfigService;
