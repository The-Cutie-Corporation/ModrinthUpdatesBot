export enum ModrinthRequiredEnum {
    required = "required",
    optional = "optional",
    unsupported = "unsupported"
}

export enum ModrinthProjectTypeEnum {
    mod = "mod",
    modpack = "modpack"
}

export enum ModrinthStatusEnum {
    approved = "approved",
    rejected = "rejected",
    draft = "draft",
    unlisted = "unlisted",
    archived = "archived",
    processing = "processing",
    unknown = "unknown",
}

export interface ModrinthProject {
    slug: string,
    title: string,
    description: string,
    categories: string[],
    client_side: ModrinthRequiredEnum,
    server_side: ModrinthRequiredEnum,
    body: string,
    issues_url: string | null,
    source_url: string | null,
    wiki_url: string | null,
    discord_url: string | null,
    donation_urls: {
        id: string,
        platform: string,
        url: string
    }[] | null,
    project_type: ModrinthProjectTypeEnum,
    downloads: number,
    icon_url: string | null,
    id: string,
    team: string,
    moderator_message: {
        message: string,
        body: string | null
    } | null,
    published: string,
    updated: string,
    followers: string,
    status: ModrinthStatusEnum,
    license: {
        id: string,
        name: string,
        url: string | null
    }
    versions: string[],
    gallery: {
        url: string,
        featured: boolean,
        title: string | null,
        description: string | null,
        created: string
    }[] | null
}

export interface ModrinthSearchResults<T> {
    hits: T[],
    offset: number,
    limit: number,
    total_hits: number
}

export interface ModrinthProjectSearchResult {
    slug: string,
    title: string,
    description: string,
    categories: string[],
    client_side: ModrinthRequiredEnum,
    server_side: ModrinthRequiredEnum,
    project_type: ModrinthProjectTypeEnum,
    downloads: number,
    icon_url: string | null,
    project_id: string,
    author: string,
    versions: string[],
    follows: number,
    date_created: string,
    date_modified: string,
    latest_version: string,
    license: string,
    gallery: string[]
}

export enum ModrinthDependencyTypeEnum {
    required = "required",
    optional = "optional",
    incompatible = "incompatible"
}

export enum ModrinthVersionTypeEnum {
    release = "release",
    beta = "beta",
    alpha = "alpha"
}

export interface ModrinthVersion {
    name: string,
    version_number: string,
    changelog: string | null,
    dependencies: {
        version_id: string | null,
        project_id: string | null,
        dependency_type: ModrinthDependencyTypeEnum
    }[] | null,
    game_versions: string[],
    version_type: ModrinthVersionTypeEnum,
    loaders: string[],
    featured: boolean,
    id: string,
    project_id: string,
    author_id: string,
    date_published: string,
    downloads: number,
    files: {
        hashes: {
            sha512: string,
            sha1: string
        },
        url: string,
        filename: string,
        primary: boolean,
        size: number
    }[]
}
