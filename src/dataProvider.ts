import axios, { AxiosInstance } from "axios";
import {
    DataProvider,
    HttpError,
    CrudOperators,
    CrudFilters,
    CrudSorting,
} from "@pankod/refine-core";
import { Constants } from "helpers/constants";
import moment from 'moment';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        if (error.response.status === 422) {
            const data = error.response.data;

            const customError: HttpError = {
                ...data,
                errors: { name: 'Error' },
                message: error.response?.data?.message,
                statusCode: error.response?.status,
            };
        }

        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    },
);

const mapOperator = (operator: CrudOperators): string => {
    switch (operator) {
        case "ne":
        case "gte":
        case "lte":
            return `_${operator}`;
        case "contains":
            return "_like";
        case "eq":
        default:
            return "";
    }
};

const generateSort = (sort?: CrudSorting) => {
    if (sort && sort.length > 0) {
        const _sort: string[] = [];
        const _order: string[] = [];

        sort.map((item) => {
            _sort.push(item.field);
            _order.push(item.order);
        });

        return {
            _sort,
            _order,
        };
    }

    return;
};

const generateFilter = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: string } = {};
    if (filters) {
        filters.map((filter) => {
            if (filter.operator !== "or") {
                const { field, operator, value } = filter;

                if (field === "q") {
                    queryFilters[field] = value;
                    return;
                }

                const mappedOperator = mapOperator(operator);
                queryFilters[`${field}${mappedOperator}`] = value;
            }
        });
    }

    return queryFilters;
};

const getHeaders = (httpClient: AxiosInstance, extraHeaders:object = {}) => {
    return {
        ...httpClient.defaults.headers,
        ...{
            'accept': 'application/ld+json',
            'Authorization': `Bearer ${localStorage.getItem(Constants.TOKEN_KEY)}`
        },
        ...extraHeaders
    };
}

const JsonServer = (
    apiUrl: string,
    httpClient: AxiosInstance = axiosInstance,
): DataProvider => ({
    getList: async ({
        resource,
        hasPagination = false,
        pagination = { current: 1, pageSize: 10 },
        filters,
        sort,
    }) => {

        const { current = 1, pageSize = 10 } = pagination ?? {};
        const url = `${apiUrl}/${resource}${hasPagination ? `?page=${current}&itemsPerPage=${pageSize}` : ``}`;
        let queryFilters = generateFilter(filters);

        if (hasPagination === false) {
            queryFilters.pagination = 'false';
        }

        const query: {
            _start?: number;
            _end?: number;
            _sort?: string;
            _order?: string;
        } = hasPagination
                ? {
                    _start: (current - 1) * pageSize,
                    _end: current * pageSize,
                }
                : {};

        const generatedSort = generateSort(sort);
        if (generatedSort) {
            const { _sort, _order } = generatedSort;
            query._sort = _sort.join(",");
            query._order = _order.join(",");
        }

        let and = '';
        let queryFilter = '';
        
        for (const [key, value] of Object.entries(queryFilters)) {
            if (value === "") {
                continue;
            }

            const keys = key.split('_');

            if (keys.length === 2) {

                if (moment(value).isValid() && keys[1] === 'gte') {
                    queryFilter += `${and}${keys[0]}[after]=${moment(value).format('YYYY-MM-DD')} 00:00:00`;
                } else if (moment(value).isValid() && keys[1] === 'lte') {
                    queryFilter += `${and}${keys[0]}[before]=${moment(value).format('YYYY-MM-DD')} 23:59:59`;
                } else if (keys[1] === 'like') {
                    queryFilter += `${and}${keys[0]}=${value}`;
                } else {
                    queryFilter += `${and}${keys[0]}[${keys[1]}]=${value}`;
                }                
                
            } else {
                queryFilter += and + key + "=" + value;
            }
            
            and = "&";
        }

        httpClient.defaults.headers = getHeaders(httpClient);
        const { data, headers } = await httpClient.get(
            `${url}${queryFilter !== "" ? (hasPagination ? "&":"?") + queryFilter : ""}`,
        );

        const total = +headers["x-total-count"];


        return {
            data: data['hydra:member'],
            total: data['hydra:totalItems'],
        };
    },

    getMany: async ({ resource, ids }) => {
        httpClient.defaults.headers = getHeaders(httpClient);
        const { data } = await httpClient.get(
            `${apiUrl}/${resource}?${JSON.stringify({ id: ids })}`,
        );

        return {
            data,
        };
    },

    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/${resource}`;

        httpClient.defaults.headers = getHeaders(httpClient);
        const { data } = await httpClient.post(url, variables);

        return {
            data,
        };
    },

    createMany: async ({ resource, variables }) => {
        const response = await Promise.all(
            variables.map(async (param) => {
                httpClient.defaults.headers = getHeaders(httpClient);
                const { data } = await httpClient.post(
                    `${apiUrl}/${resource}`,
                    param,
                );
                return data;
            }),
        );

        return { data: response };
    },

    update: async ({ resource, id, variables, ...rest }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        httpClient.defaults.headers = getHeaders(httpClient, {
            'Content-Type': 'application/ld+json; charset=utf-8'
        });
        const { data } = await httpClient.put(url, variables);

        return {
            data,
        };
    },

    updateMany: async ({ resource, ids, variables }) => {
        const response = await Promise.all(
            ids.map(async (id) => {
                httpClient.defaults.headers = getHeaders(httpClient);
                const { data } = await httpClient.patch(
                    `${apiUrl}/${resource}/${id}`,
                    variables,
                );
                return data;
            }),
        );

        return { data: response };
    },

    getOne: async ({ resource, id }) => {        
        const url = `${apiUrl}/${resource.replaceAll('/', '')}/${id}`;

        httpClient.defaults.headers = getHeaders(httpClient);
        const { data } = await httpClient.get(url);

        return {
            data,
        };
    },

    deleteOne: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        httpClient.defaults.headers = getHeaders(httpClient);
        const { data } = await httpClient.delete(
            url,
            //variables
        );

        return {
            data,
        };
    },

    deleteMany: async ({ resource, ids, variables }) => {
        const response = await Promise.all(
            ids.map(async (id) => {
                httpClient.defaults.headers = getHeaders(httpClient);
                const { data } = await httpClient.delete(
                    `${apiUrl}/${resource}/${id}`,
                    //variables,
                );
                return data;
            }),
        );
        return { data: response };
    },

    getApiUrl: () => {
        return apiUrl;
    },

    custom: async ({ url, method, filters, sort, payload, query, headers }) => {
        let requestUrl = `${url}?`;

        if (sort) {
            const generatedSort = generateSort(sort);
            if (generatedSort) {
                const { _sort, _order } = generatedSort;
                const sortQuery = {
                    _sort: _sort.join(","),
                    _order: _order.join(","),
                };
                requestUrl = `${requestUrl}&${JSON.stringify(sortQuery)}`;
            }
        }

        if (filters) {
            const filterQuery = generateFilter(filters);
            requestUrl = `${requestUrl}&${JSON.stringify(filterQuery)}`;
        }

        if (query) {
            requestUrl = `${requestUrl}&${JSON.stringify(query)}`;
        }

        httpClient.defaults.headers = getHeaders(httpClient, headers || {});

        let axiosResponse;
        switch (method) {
            case "put":
            case "post":
            case "patch":
                axiosResponse = await httpClient[method](url, payload);
                break;
            case "delete":
                axiosResponse = await httpClient.delete(url, {
                    data: payload,
                });
                break;
            default:
                axiosResponse = await httpClient.get(requestUrl);
                break;
        }

        const { data } = axiosResponse;

        return Promise.resolve({ data });
    },
});

export default JsonServer;