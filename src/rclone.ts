const remoteGenerator: Fig.Generator = {
  script: "rclone listremotes",
  postProcess: (out) =>
    out.split("\n").map((remote) => ({
      name: remote,
    })),
};

const cryptedRemoteGenerator: Fig.Generator = {
  script: "rclone listremotes --long",
  postProcess: (out) =>
    out
      .split("\n")
      .map((line) => {
        const [, name, backend] = line.match(/^([^:]+:)\s+(.+)$/);
        return { name, backend };
      })
      .filter((remote) => remote.backend === "crypt"),
};

const pathGenerator: Fig.Generator = {
  script: (tokens) => `rclone lsf ${tokens[2]}`,
  postProcess: (out, tokens) =>
    out.split("\n").map((path) => ({ name: `${tokens[2]}${path}` })),
};

const cryptedRemote: Fig.Arg = {
  name: "cryptedremote",
  generators: cryptedRemoteGenerator,
};

const remote: Fig.Arg = {
  name: "remote:",
  generators: remoteGenerator,
};

const remotePath: Fig.Arg = {
  name: "remote:path",
  generators: [remoteGenerator, pathGenerator],
};
const sourcePath: Fig.Arg = {
  name: "source:path",
  generators: remotePath.generators,
};
const destPath: Fig.Arg = {
  name: "dest:path",
  generators: remotePath.generators,
};

/** As of rclone 1.59.1, sourced with `rclone hashsum` */
const hashes = [
  "md5",
  "sha1",
  "whirlpool",
  "crc32",
  "sha256",
  "dropbox",
  "hidrive",
  "mailru",
  "quickxor",
];

/** As of rclone v1.59.1, sourced with:
 * `rclone config providers | jq '[.[]|{name:.Name,description:.Description}]'`*/
const providers = [
  {
    name: "alias",
    description: "Alias for an existing remote",
  },
  {
    name: "amazon cloud drive",
    description: "Amazon Drive",
  },
  {
    name: "azureblob",
    description: "Microsoft Azure Blob Storage",
  },
  {
    name: "b2",
    description: "Backblaze B2",
  },
  {
    name: "box",
    description: "Box",
  },
  {
    name: "crypt",
    description: "Encrypt/Decrypt a remote",
  },
  {
    name: "cache",
    description: "Cache a remote",
  },
  {
    name: "chunker",
    description: "Transparently chunk/split large files",
  },
  {
    name: "combine",
    description: "Combine several remotes into one",
  },
  {
    name: "compress",
    description: "Compress a remote",
  },
  {
    name: "drive",
    description: "Google Drive",
  },
  {
    name: "dropbox",
    description: "Dropbox",
  },
  {
    name: "fichier",
    description: "1Fichier",
  },
  {
    name: "filefabric",
    description: "Enterprise File Fabric",
  },
  {
    name: "ftp",
    description: "FTP",
  },
  {
    name: "google cloud storage",
    description: "Google Cloud Storage (this is not Google Drive)",
  },
  {
    name: "google photos",
    description: "Google Photos",
  },
  {
    name: "hasher",
    description: "Better checksums for other remotes",
  },
  {
    name: "hdfs",
    description: "Hadoop distributed file system",
  },
  {
    name: "hidrive",
    description: "HiDrive",
  },
  {
    name: "http",
    description: "HTTP",
  },
  {
    name: "swift",
    description:
      "OpenStack Swift (Rackspace Cloud Files, Memset Memstore, OVH)",
  },
  {
    name: "hubic",
    description: "Hubic",
  },
  {
    name: "internetarchive",
    description: "Internet Archive",
  },
  {
    name: "jottacloud",
    description: "Jottacloud",
  },
  {
    name: "koofr",
    description:
      "Koofr, Digi Storage and other Koofr-compatible storage providers",
  },
  {
    name: "local",
    description: "Local Disk",
  },
  {
    name: "mailru",
    description: "Mail.ru Cloud",
  },
  {
    name: "mega",
    description: "Mega",
  },
  {
    name: "memory",
    description: "In memory object storage system",
  },
  {
    name: "netstorage",
    description: "Akamai NetStorage",
  },
  {
    name: "onedrive",
    description: "Microsoft OneDrive",
  },
  {
    name: "opendrive",
    description: "OpenDrive",
  },
  {
    name: "pcloud",
    description: "Pcloud",
  },
  {
    name: "premiumizeme",
    description: "Premiumize.me",
  },
  {
    name: "putio",
    description: "Put.io",
  },
  {
    name: "qingstor",
    description: "QingCloud Object Storage",
  },
  {
    name: "s3",
    description:
      "Amazon S3 Compliant Storage Providers including AWS, Alibaba, Ceph, China Mobile, Cloudflare, ArvanCloud, Digital Ocean, Dreamhost, Huawei OBS, IBM COS, IDrive e2, Lyve Cloud, Minio, Netease, RackCorp, Scaleway, SeaweedFS, StackPath, Storj, Tencent COS and Wasabi",
  },
  {
    name: "seafile",
    description: "Seafile",
  },
  {
    name: "sftp",
    description: "SSH/SFTP",
  },
  {
    name: "sharefile",
    description: "Citrix Sharefile",
  },
  {
    name: "sia",
    description: "Sia Decentralized Cloud",
  },
  {
    name: "storj",
    description: "Storj Decentralized Cloud Storage",
  },
  {
    name: "tardigrade",
    description: "Storj Decentralized Cloud Storage",
  },
  {
    name: "sugarsync",
    description: "Sugarsync",
  },
  {
    name: "union",
    description: "Union merges the contents of several upstream fs",
  },
  {
    name: "uptobox",
    description: "Uptobox",
  },
  {
    name: "webdav",
    description: "WebDAV",
  },
  {
    name: "yandex",
    description: "Yandex Disk",
  },
  {
    name: "zoho",
    description: "Zoho",
  },
];

const options = [
  { name: ["--version", "-V"], description: "Print the version number" },
  { name: ["--help", "-h"], description: "Display help", isPersistent: true },
  {
    name: "--acd-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "acd-auth-url" },
  },
  {
    name: "--acd-checkpoint",
    description: "Checkpoint for internal polling (debug)",
    isPersistent: true,
    hidden: true,
    args: { name: "acd-checkpoint" },
  },
  {
    name: "--acd-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "acd-client-id" },
  },
  {
    name: "--acd-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "acd-client-secret" },
  },
  {
    name: "--acd-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "acd-encoding", default: "Slash,InvalidUtf8,Dot" },
  },
  {
    name: "--acd-templink-threshold",
    description: "Files >= this size will be downloaded via their tempLink",
    isPersistent: true,
    args: { name: "acd-templink-threshold", default: "9Gi" },
  },
  {
    name: "--acd-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "acd-token" },
  },
  {
    name: "--acd-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "acd-token-url" },
  },
  {
    name: "--acd-upload-wait-per-gb",
    description:
      "Additional time per GiB to wait after a failed complete upload to see if it appears",
    isPersistent: true,
    args: { name: "acd-upload-wait-per-gb", default: "3m0s" },
  },
  {
    name: "--alias-remote",
    description: "Remote or path to alias",
    isPersistent: true,
    args: { name: "alias-remote" },
  },
  {
    name: "--ask-password",
    description: "Allow prompt for password for encrypted configuration",
    isPersistent: true,
  },
  {
    name: "--auto-confirm",
    description: "If enabled, do not request console confirmation",
    isPersistent: true,
  },
  {
    name: "--azureblob-access-tier",
    description: "Access tier of blob: hot, cool or archive",
    isPersistent: true,
    args: { name: "azureblob-access-tier" },
  },
  {
    name: "--azureblob-account",
    description: "Storage Account Name",
    isPersistent: true,
    args: { name: "azureblob-account" },
  },
  {
    name: "--azureblob-archive-tier-delete",
    description: "Delete archive tier blobs before overwriting",
    isPersistent: true,
  },
  {
    name: "--azureblob-chunk-size",
    description: "Upload chunk size",
    isPersistent: true,
    args: { name: "azureblob-chunk-size", default: "4Mi" },
  },
  {
    name: "--azureblob-disable-checksum",
    description: "Don't store MD5 checksum with object metadata",
    isPersistent: true,
  },
  {
    name: "--azureblob-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "azureblob-encoding",
      default: "Slash,BackSlash,Del,Ctl,RightPeriod,InvalidUtf8",
    },
  },
  {
    name: "--azureblob-endpoint",
    description: "Endpoint for the service",
    isPersistent: true,
    args: { name: "azureblob-endpoint" },
  },
  {
    name: "--azureblob-key",
    description: "Storage Account Key",
    isPersistent: true,
    args: { name: "azureblob-key" },
  },
  {
    name: "--azureblob-list-chunk",
    description: "Size of blob list",
    isPersistent: true,
    args: { name: "azureblob-list-chunk", default: "5000" },
  },
  {
    name: "--azureblob-memory-pool-flush-time",
    description: "How often internal memory buffer pools will be flushed",
    isPersistent: true,
    args: { name: "azureblob-memory-pool-flush-time", default: "1m0s" },
  },
  {
    name: "--azureblob-memory-pool-use-mmap",
    description: "Whether to use mmap buffers in internal memory pool",
    isPersistent: true,
  },
  {
    name: "--azureblob-msi-client-id",
    description: "Object ID of the user-assigned MSI to use, if any",
    isPersistent: true,
    args: { name: "azureblob-msi-client-id" },
  },
  {
    name: "--azureblob-msi-mi-res-id",
    description: "Azure resource ID of the user-assigned MSI to use, if any",
    isPersistent: true,
    args: { name: "azureblob-msi-mi-res-id" },
  },
  {
    name: "--azureblob-msi-object-id",
    description: "Object ID of the user-assigned MSI to use, if any",
    isPersistent: true,
    args: { name: "azureblob-msi-object-id" },
  },
  {
    name: "--azureblob-no-head-object",
    description: "If set, do not do HEAD before GET when getting objects",
    isPersistent: true,
  },
  {
    name: "--azureblob-public-access",
    description: "Public access level of a container: blob or container",
    isPersistent: true,
    args: { name: "azureblob-public-access" },
  },
  {
    name: "--azureblob-sas-url",
    description: "SAS URL for container level access only",
    isPersistent: true,
    args: { name: "azureblob-sas-url" },
  },
  {
    name: "--azureblob-service-principal-file",
    description:
      "Path to file containing credentials for use with a service principal",
    isPersistent: true,
    args: { name: "azureblob-service-principal-file" },
  },
  {
    name: "--azureblob-upload-concurrency",
    description: "Concurrency for multipart uploads",
    isPersistent: true,
    args: { name: "azureblob-upload-concurrency", default: "16" },
  },
  {
    name: "--azureblob-upload-cutoff",
    description:
      "Cutoff for switching to chunked upload (<= 256 MiB) (deprecated)",
    isPersistent: true,
    args: { name: "azureblob-upload-cutoff" },
  },
  {
    name: "--azureblob-use-emulator",
    description: "Uses local storage emulator if provided as 'true'",
    isPersistent: true,
  },
  {
    name: "--azureblob-use-msi",
    description:
      "Use a managed service identity to authenticate (only works in Azure)",
    isPersistent: true,
  },
  {
    name: "--b2-account",
    description: "Account ID or Application Key ID",
    isPersistent: true,
    args: { name: "b2-account" },
  },
  {
    name: "--b2-chunk-size",
    description: "Upload chunk size",
    isPersistent: true,
    args: { name: "b2-chunk-size", default: "96Mi" },
  },
  {
    name: "--b2-copy-cutoff",
    description: "Cutoff for switching to multipart copy",
    isPersistent: true,
    args: { name: "b2-copy-cutoff", default: "4Gi" },
  },
  {
    name: "--b2-disable-checksum",
    description: "Disable checksums for large (> upload cutoff) files",
    isPersistent: true,
  },
  {
    name: "--b2-download-auth-duration",
    description:
      "Time before the authorization token will expire in s or suffix ms|s|m|h|d",
    isPersistent: true,
    args: { name: "b2-download-auth-duration", default: "1w" },
  },
  {
    name: "--b2-download-url",
    description: "Custom endpoint for downloads",
    isPersistent: true,
    args: { name: "b2-download-url" },
  },
  {
    name: "--b2-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "b2-encoding",
      default: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--b2-endpoint",
    description: "Endpoint for the service",
    isPersistent: true,
    args: { name: "b2-endpoint" },
  },
  {
    name: "--b2-hard-delete",
    description:
      "Permanently delete files on remote removal, otherwise hide files",
    isPersistent: true,
  },
  {
    name: "--b2-key",
    description: "Application Key",
    isPersistent: true,
    args: { name: "b2-key" },
  },
  {
    name: "--b2-memory-pool-flush-time",
    description: "How often internal memory buffer pools will be flushed",
    isPersistent: true,
    args: { name: "b2-memory-pool-flush-time", default: "1m0s" },
  },
  {
    name: "--b2-memory-pool-use-mmap",
    description: "Whether to use mmap buffers in internal memory pool",
    isPersistent: true,
  },
  {
    name: "--b2-test-mode",
    description: "A flag string for X-Bz-Test-Mode header for debugging",
    isPersistent: true,
    args: { name: "b2-test-mode" },
  },
  {
    name: "--b2-upload-cutoff",
    description: "Cutoff for switching to chunked upload",
    isPersistent: true,
    args: { name: "b2-upload-cutoff", default: "200Mi" },
  },
  {
    name: "--b2-version-at",
    description: "Show file versions as they were at the specified time",
    isPersistent: true,
    args: { name: "b2-version-at", default: "off" },
  },
  {
    name: "--b2-versions",
    description: "Include old versions in directory listings",
    isPersistent: true,
  },
  {
    name: "--backup-dir",
    description: "Make backups into hierarchy based in DIR",
    isPersistent: true,
    args: { name: "backup-dir" },
  },
  {
    name: "--bind",
    description:
      "Local address to bind to for outgoing connections, IPv4, IPv6 or name",
    isPersistent: true,
    args: { name: "bind" },
  },
  {
    name: "--box-access-token",
    description: "Box App Primary Access Token",
    isPersistent: true,
    args: { name: "box-access-token" },
  },
  {
    name: "--box-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "box-auth-url" },
  },
  {
    name: "--box-box-config-file",
    description: "Box App config.json location",
    isPersistent: true,
    args: { name: "box-box-config-file" },
  },
  {
    name: "--box-box-sub-type",
    description: "",
    isPersistent: true,
    args: { name: "box-box-sub-type", default: "user" },
  },
  {
    name: "--box-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "box-client-id" },
  },
  {
    name: "--box-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "box-client-secret" },
  },
  {
    name: "--box-commit-retries",
    description: "Max number of times to try committing a multipart file",
    isPersistent: true,
    args: { name: "box-commit-retries", default: "100" },
  },
  {
    name: "--box-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "box-encoding",
      default: "Slash,BackSlash,Del,Ctl,RightSpace,InvalidUtf8,Dot",
    },
  },
  {
    name: "--box-list-chunk",
    description: "Size of listing chunk 1-1000",
    isPersistent: true,
    args: { name: "box-list-chunk", default: "1000" },
  },
  {
    name: "--box-owned-by",
    description: "Only show items owned by the login (email address) passed in",
    isPersistent: true,
    args: { name: "box-owned-by" },
  },
  {
    name: "--box-root-folder-id",
    description:
      "Fill in for rclone to use a non root folder as its starting point",
    isPersistent: true,
    args: { name: "box-root-folder-id", default: "0" },
  },
  {
    name: "--box-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "box-token" },
  },
  {
    name: "--box-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "box-token-url" },
  },
  {
    name: "--box-upload-cutoff",
    description: "Cutoff for switching to multipart upload (>= 50 MiB)",
    isPersistent: true,
    args: { name: "box-upload-cutoff", default: "50Mi" },
  },
  {
    name: "--buffer-size",
    description: "In memory buffer size when reading files for each --transfer",
    isPersistent: true,
    args: { name: "buffer-size", default: "16Mi" },
  },
  {
    name: "--bwlimit",
    description:
      "Bandwidth limit in KiB/s, or use suffix B|K|M|G|T|P or a full timetable",
    isPersistent: true,
    args: { name: "bwlimit" },
  },
  {
    name: "--bwlimit-file",
    description:
      "Bandwidth limit per file in KiB/s, or use suffix B|K|M|G|T|P or a full timetable",
    isPersistent: true,
    args: { name: "bwlimit-file" },
  },
  {
    name: "--ca-cert",
    description: "CA certificate used to verify servers",
    isPersistent: true,
    args: { name: "ca-cert" },
  },
  {
    name: "--cache-chunk-clean-interval",
    description:
      "How often should the cache perform cleanups of the chunk storage",
    isPersistent: true,
    args: { name: "cache-chunk-clean-interval", default: "1m0s" },
  },
  {
    name: "--cache-chunk-no-memory",
    description:
      "Disable the in-memory cache for storing chunks during streaming",
    isPersistent: true,
  },
  {
    name: "--cache-chunk-path",
    description: "Directory to cache chunk files",
    isPersistent: true,
    args: {
      name: "cache-chunk-path",
      default: "/Users/ryan/Library/Caches/rclone/cache-backend",
    },
  },
  {
    name: "--cache-chunk-size",
    description: "The size of a chunk (partial file data)",
    isPersistent: true,
    args: { name: "cache-chunk-size", default: "5Mi" },
  },
  {
    name: "--cache-chunk-total-size",
    description: "The total size that the chunks can take up on the local disk",
    isPersistent: true,
    args: { name: "cache-chunk-total-size", default: "10Gi" },
  },
  {
    name: "--cache-db-path",
    description: "Directory to store file structure metadata DB",
    isPersistent: true,
    args: {
      name: "cache-db-path",
      default: "/Users/ryan/Library/Caches/rclone/cache-backend",
    },
  },
  {
    name: "--cache-db-purge",
    description: "Clear all the cached data for this remote on start",
    isPersistent: true,
  },
  {
    name: "--cache-db-wait-time",
    description: "How long to wait for the DB to be available - 0 is unlimited",
    isPersistent: true,
    args: { name: "cache-db-wait-time", default: "1s" },
  },
  {
    name: "--cache-dir",
    description: "Directory rclone will use for caching",
    isPersistent: true,
    args: { name: "cache-dir", default: "/Users/ryan/Library/Caches/rclone" },
  },
  {
    name: "--cache-info-age",
    description:
      "How long to cache file structure information (directory listings, file size, times, etc.)",
    isPersistent: true,
    args: { name: "cache-info-age", default: "6h0m0s" },
  },
  {
    name: "--cache-plex-insecure",
    description:
      "Skip all certificate verification when connecting to the Plex server",
    isPersistent: true,
    args: { name: "cache-plex-insecure" },
  },
  {
    name: "--cache-plex-password",
    description: "The password of the Plex user (obscured)",
    isPersistent: true,
    args: { name: "cache-plex-password" },
  },
  {
    name: "--cache-plex-token",
    description: "The plex token for authentication - auto set normally",
    isPersistent: true,
    hidden: true,
    args: { name: "cache-plex-token" },
  },
  {
    name: "--cache-plex-url",
    description: "The URL of the Plex server",
    isPersistent: true,
    args: { name: "cache-plex-url" },
  },
  {
    name: "--cache-plex-username",
    description: "The username of the Plex user",
    isPersistent: true,
    args: { name: "cache-plex-username" },
  },
  {
    name: "--cache-read-retries",
    description: "How many times to retry a read from a cache storage",
    isPersistent: true,
    args: { name: "cache-read-retries", default: "10" },
  },
  {
    name: "--cache-remote",
    description: "Remote to cache",
    isPersistent: true,
    args: { name: "cache-remote" },
  },
  {
    name: "--cache-rps",
    description:
      "Limits the number of requests per second to the source FS (-1 to disable)",
    isPersistent: true,
    args: { name: "cache-rps", default: "-1" },
  },
  {
    name: "--cache-tmp-upload-path",
    description: "Directory to keep temporary files until they are uploaded",
    isPersistent: true,
    args: { name: "cache-tmp-upload-path" },
  },
  {
    name: "--cache-tmp-wait-time",
    description:
      "How long should files be stored in local cache before being uploaded",
    isPersistent: true,
    args: { name: "cache-tmp-wait-time", default: "15s" },
  },
  {
    name: "--cache-workers",
    description: "How many workers should run in parallel to download chunks",
    isPersistent: true,
    args: { name: "cache-workers", default: "4" },
  },
  {
    name: "--cache-writes",
    description: "Cache file data on writes through the FS",
    isPersistent: true,
  },
  {
    name: "--check-first",
    description: "Do all the checks before starting transfers",
    isPersistent: true,
  },
  {
    name: "--checkers",
    description: "Number of checkers to run in parallel",
    isPersistent: true,
    args: { name: "checkers", default: "8" },
  },
  {
    name: ["--checksum", "-c"],
    description:
      "Skip based on checksum (if available) & size, not mod-time & size",
    isPersistent: true,
  },
  {
    name: "--chunker-chunk-size",
    description: "Files larger than chunk size will be split in chunks",
    isPersistent: true,
    args: { name: "chunker-chunk-size", default: "2Gi" },
  },
  {
    name: "--chunker-fail-hard",
    description:
      "Choose how chunker should handle files with missing or invalid chunks",
    isPersistent: true,
  },
  {
    name: "--chunker-hash-type",
    description: "Choose how chunker handles hash sums",
    isPersistent: true,
    args: { name: "chunker-hash-type", default: "md5" },
  },
  {
    name: "--chunker-meta-format",
    description: 'Format of the metadata object or "none"',
    isPersistent: true,
    hidden: true,
    args: { name: "chunker-meta-format", default: "simplejson" },
  },
  {
    name: "--chunker-name-format",
    description: "String format of chunk file names",
    isPersistent: true,
    hidden: true,
    args: { name: "chunker-name-format", default: "*.rclone_chunk.###" },
  },
  {
    name: "--chunker-remote",
    description: "Remote to chunk/unchunk",
    isPersistent: true,
    args: { name: "chunker-remote" },
  },
  {
    name: "--chunker-start-from",
    description: "Minimum valid chunk number. Usually 0 or 1",
    isPersistent: true,
    hidden: true,
    args: { name: "chunker-start-from", default: "1" },
  },
  {
    name: "--chunker-transactions",
    description:
      "Choose how chunker should handle temporary files during transactions",
    isPersistent: true,
    hidden: true,
    args: { name: "chunker-transactions", default: "rename" },
  },
  {
    name: "--client-cert",
    description: "Client SSL certificate (PEM) for mutual TLS auth",
    isPersistent: true,
    args: { name: "client-cert" },
  },
  {
    name: "--client-key",
    description: "Client SSL private key (PEM) for mutual TLS auth",
    isPersistent: true,
    args: { name: "client-key" },
  },
  {
    name: "--combine-upstreams",
    description: "Upstreams for combining",
    isPersistent: true,
    args: { name: "combine-upstreams" },
  },
  {
    name: "--compare-dest",
    description:
      "Include additional comma separated server-side paths during comparison",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "compare-dest" },
  },
  {
    name: "--compress-level",
    description: "GZIP compression level (-2 to 9)",
    isPersistent: true,
    args: { name: "compress-level", default: "-1" },
  },
  {
    name: "--compress-mode",
    description: "Compression mode",
    isPersistent: true,
    args: { name: "compress-mode", default: "gzip" },
  },
  {
    name: "--compress-ram-cache-limit",
    description:
      "Some remotes don't allow the upload of files with unknown size",
    isPersistent: true,
    args: { name: "compress-ram-cache-limit", default: "20Mi" },
  },
  {
    name: "--compress-remote",
    description: "Remote to compress",
    isPersistent: true,
    args: { name: "compress-remote" },
  },
  {
    name: "--config",
    description: "Config file",
    isPersistent: true,
    args: {
      name: "config",
      default: "/Users/ryan/.config/rclone/rclone.conf",
    },
  },
  {
    name: "--contimeout",
    description: "Connect timeout",
    isPersistent: true,
    args: { name: "contimeout", default: "1m0s" },
  },
  {
    name: "--copy-dest",
    description:
      "Implies --compare-dest but also copies files from paths into destination",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "copy-dest" },
  },
  {
    name: ["--copy-links", "-L"],
    description: "Follow symlinks and copy the pointed to item",
    isPersistent: true,
  },
  {
    name: "--cpuprofile",
    description: "Write cpu profile to file",
    isPersistent: true,
    args: { name: "cpuprofile" },
  },
  {
    name: "--crypt-directory-name-encryption",
    description:
      "Option to either encrypt directory names or leave them intact",
    isPersistent: true,
  },
  {
    name: "--crypt-filename-encoding",
    description: "How to encode the encrypted filename to text string",
    isPersistent: true,
    args: { name: "crypt-filename-encoding", default: "base32" },
  },
  {
    name: "--crypt-filename-encryption",
    description: "How to encrypt the filenames",
    isPersistent: true,
    args: { name: "crypt-filename-encryption", default: "standard" },
  },
  {
    name: "--crypt-no-data-encryption",
    description: "Option to either encrypt file data or leave it unencrypted",
    isPersistent: true,
  },
  {
    name: "--crypt-password",
    description: "Password or pass phrase for encryption (obscured)",
    isPersistent: true,
    args: { name: "crypt-password" },
  },
  {
    name: "--crypt-password2",
    description: "Password or pass phrase for salt (obscured)",
    isPersistent: true,
    args: { name: "crypt-password2" },
  },
  {
    name: "--crypt-remote",
    description: "Remote to encrypt/decrypt",
    isPersistent: true,
    args: { name: "crypt-remote" },
  },
  {
    name: "--crypt-server-side-across-configs",
    description:
      "Allow server-side operations (e.g. copy) to work across different crypt configs",
    isPersistent: true,
  },
  {
    name: "--crypt-show-mapping",
    description: "For all files listed show how the names encrypt",
    isPersistent: true,
  },
  {
    name: "--cutoff-mode",
    description:
      "Mode to stop transfers when reaching the max transfer limit HARD|SOFT|CAUTIOUS",
    isPersistent: true,
    args: { name: "cutoff-mode", default: "HARD" },
  },
  {
    name: "--delete-after",
    description:
      "When synchronizing, delete files on destination after transferring (default)",
    isPersistent: true,
  },
  {
    name: "--delete-before",
    description:
      "When synchronizing, delete files on destination before transferring",
    isPersistent: true,
  },
  {
    name: "--delete-during",
    description: "When synchronizing, delete files during transfer",
    isPersistent: true,
  },
  {
    name: "--delete-excluded",
    description: "Delete files on dest excluded from sync",
    isPersistent: true,
  },
  {
    name: "--disable",
    description:
      "Disable a comma separated list of features (use --disable help to see a list)",
    isPersistent: true,
    args: { name: "disable" },
  },
  {
    name: "--disable-http-keep-alives",
    description: "Disable HTTP keep-alives and use each connection once",
    isPersistent: true,
  },
  {
    name: "--disable-http2",
    description: "Disable HTTP/2 in the global transport",
    isPersistent: true,
  },
  {
    name: "--drive-acknowledge-abuse",
    description:
      "Set to allow files which return cannotDownloadAbusiveFile to be downloaded",
    isPersistent: true,
  },
  {
    name: "--drive-allow-import-name-change",
    description: "Allow the filetype to change when uploading Google docs",
    isPersistent: true,
  },
  {
    name: "--drive-alternate-export",
    description: "Deprecated: No longer needed",
    isPersistent: true,
    hidden: true,
  },
  {
    name: "--drive-auth-owner-only",
    description: "Only consider files owned by the authenticated user",
    isPersistent: true,
  },
  {
    name: "--drive-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "drive-auth-url" },
  },
  {
    name: "--drive-chunk-size",
    description: "Upload chunk size",
    isPersistent: true,
    args: { name: "drive-chunk-size", default: "8Mi" },
  },
  {
    name: "--drive-client-id",
    description: "Google Application Client Id",
    isPersistent: true,
    args: { name: "drive-client-id" },
  },
  {
    name: "--drive-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "drive-client-secret" },
  },
  {
    name: "--drive-copy-shortcut-content",
    description:
      "Server side copy contents of shortcuts instead of the shortcut",
    isPersistent: true,
  },
  {
    name: "--drive-disable-http2",
    description: "Disable drive using http2",
    isPersistent: true,
  },
  {
    name: "--drive-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "drive-encoding", default: "InvalidUtf8" },
  },
  {
    name: "--drive-export-formats",
    description:
      "Comma separated list of preferred formats for downloading Google docs",
    isPersistent: true,
    args: { name: "drive-export-formats", default: "docx,xlsx,pptx,svg" },
  },
  {
    name: "--drive-formats",
    description: "Deprecated: See export_formats",
    isPersistent: true,
    args: { name: "drive-formats" },
  },
  {
    name: "--drive-impersonate",
    description: "Impersonate this user when using a service account",
    isPersistent: true,
    args: { name: "drive-impersonate" },
  },
  {
    name: "--drive-import-formats",
    description:
      "Comma separated list of preferred formats for uploading Google docs",
    isPersistent: true,
    args: { name: "drive-import-formats" },
  },
  {
    name: "--drive-keep-revision-forever",
    description: "Keep new head revision of each file forever",
    isPersistent: true,
  },
  {
    name: "--drive-list-chunk",
    description: "Size of listing chunk 100-1000, 0 to disable",
    isPersistent: true,
    args: { name: "drive-list-chunk", default: "1000" },
  },
  {
    name: "--drive-pacer-burst",
    description: "Number of API calls to allow without sleeping",
    isPersistent: true,
    args: { name: "drive-pacer-burst", default: "100" },
  },
  {
    name: "--drive-pacer-min-sleep",
    description: "Minimum time to sleep between API calls",
    isPersistent: true,
    args: { name: "drive-pacer-min-sleep", default: "100ms" },
  },
  {
    name: "--drive-resource-key",
    description: "Resource key for accessing a link-shared file",
    isPersistent: true,
    args: { name: "drive-resource-key" },
  },
  {
    name: "--drive-root-folder-id",
    description: "ID of the root folder",
    isPersistent: true,
    args: { name: "drive-root-folder-id" },
  },
  {
    name: "--drive-scope",
    description:
      "Scope that rclone should use when requesting access from drive",
    isPersistent: true,
    args: { name: "drive-scope" },
  },
  {
    name: "--drive-server-side-across-configs",
    description:
      "Allow server-side operations (e.g. copy) to work across different drive configs",
    isPersistent: true,
  },
  {
    name: "--drive-service-account-credentials",
    description: "Service Account Credentials JSON blob",
    isPersistent: true,
    args: { name: "drive-service-account-credentials" },
  },
  {
    name: "--drive-service-account-file",
    description: "Service Account Credentials JSON file path",
    isPersistent: true,
    args: { name: "drive-service-account-file" },
  },
  {
    name: "--drive-shared-with-me",
    description: "Only show files that are shared with me",
    isPersistent: true,
  },
  {
    name: "--drive-size-as-quota",
    description: "Show sizes as storage quota usage, not actual size",
    isPersistent: true,
  },
  {
    name: "--drive-skip-checksum-gphotos",
    description: "Skip MD5 checksum on Google photos and videos only",
    isPersistent: true,
  },
  {
    name: "--drive-skip-dangling-shortcuts",
    description: "If set skip dangling shortcut files",
    isPersistent: true,
  },
  {
    name: "--drive-skip-gdocs",
    description: "Skip google documents in all listings",
    isPersistent: true,
  },
  {
    name: "--drive-skip-shortcuts",
    description: "If set skip shortcut files",
    isPersistent: true,
  },
  {
    name: "--drive-starred-only",
    description: "Only show files that are starred",
    isPersistent: true,
  },
  {
    name: "--drive-stop-on-download-limit",
    description: "Make download limit errors be fatal",
    isPersistent: true,
  },
  {
    name: "--drive-stop-on-upload-limit",
    description: "Make upload limit errors be fatal",
    isPersistent: true,
  },
  {
    name: "--drive-team-drive",
    description: "ID of the Shared Drive (Team Drive)",
    isPersistent: true,
    args: { name: "drive-team-drive" },
  },
  {
    name: "--drive-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "drive-token" },
  },
  {
    name: "--drive-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "drive-token-url" },
  },
  {
    name: "--drive-trashed-only",
    description: "Only show files that are in the trash",
    isPersistent: true,
  },
  {
    name: "--drive-upload-cutoff",
    description: "Cutoff for switching to chunked upload",
    isPersistent: true,
    args: { name: "drive-upload-cutoff", default: "8Mi" },
  },
  {
    name: "--drive-use-created-date",
    description: "Use file created date instead of modified date",
    isPersistent: true,
  },
  {
    name: "--drive-use-shared-date",
    description: "Use date file was shared instead of modified date",
    isPersistent: true,
  },
  {
    name: "--drive-use-trash",
    description: "Send files to the trash instead of deleting permanently",
    isPersistent: true,
  },
  {
    name: "--drive-v2-download-min-size",
    description: "If Object's are greater, use drive v2 API to download",
    isPersistent: true,
    args: { name: "drive-v2-download-min-size", default: "off" },
  },
  {
    name: "--dropbox-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "dropbox-auth-url" },
  },
  {
    name: "--dropbox-batch-commit-timeout",
    description: "Max time to wait for a batch to finish comitting",
    isPersistent: true,
    args: { name: "dropbox-batch-commit-timeout", default: "10m0s" },
  },
  {
    name: "--dropbox-batch-mode",
    description: "Upload file batching sync|async|off",
    isPersistent: true,
    args: { name: "dropbox-batch-mode", default: "sync" },
  },
  {
    name: "--dropbox-batch-size",
    description: "Max number of files in upload batch",
    isPersistent: true,
    args: { name: "dropbox-batch-size", default: "0" },
  },
  {
    name: "--dropbox-batch-timeout",
    description: "Max time to allow an idle upload batch before uploading",
    isPersistent: true,
    args: { name: "dropbox-batch-timeout", default: "0s" },
  },
  {
    name: "--dropbox-chunk-size",
    description: "Upload chunk size (< 150Mi)",
    isPersistent: true,
    args: { name: "dropbox-chunk-size", default: "48Mi" },
  },
  {
    name: "--dropbox-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "dropbox-client-id" },
  },
  {
    name: "--dropbox-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "dropbox-client-secret" },
  },
  {
    name: "--dropbox-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "dropbox-encoding",
      default: "Slash,BackSlash,Del,RightSpace,InvalidUtf8,Dot",
    },
  },
  {
    name: "--dropbox-impersonate",
    description: "Impersonate this user when using a business account",
    isPersistent: true,
    args: { name: "dropbox-impersonate" },
  },
  {
    name: "--dropbox-shared-files",
    description: "Instructs rclone to work on individual shared files",
    isPersistent: true,
  },
  {
    name: "--dropbox-shared-folders",
    description: "Instructs rclone to work on shared folders",
    isPersistent: true,
  },
  {
    name: "--dropbox-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "dropbox-token" },
  },
  {
    name: "--dropbox-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "dropbox-token-url" },
  },
  {
    name: ["--dry-run", "-n"],
    description: "Do a trial run with no permanent changes",
    isPersistent: true,
  },
  {
    name: "--dscp",
    description:
      "Set DSCP value to connections, value or name, e.g. CS1, LE, DF, AF21",
    isPersistent: true,
    args: { name: "dscp" },
  },
  {
    name: "--dump",
    description:
      "List of items to dump from: headers,bodies,requests,responses,auth,filters,goroutines,openfiles",
    isPersistent: true,
    args: { name: "dump" },
  },
  {
    name: "--dump-bodies",
    description: "Dump HTTP headers and bodies - may contain sensitive info",
    isPersistent: true,
  },
  {
    name: "--dump-headers",
    description: "Dump HTTP headers - may contain sensitive info",
    isPersistent: true,
  },
  {
    name: "--error-on-no-transfer",
    description:
      "Sets exit code 9 if no files are transferred, useful in scripts",
    isPersistent: true,
  },
  {
    name: "--exclude",
    description: "Exclude files matching pattern",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "exclude" },
  },
  {
    name: "--exclude-from",
    description: "Read exclude patterns from file (use - to read from stdin)",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "exclude-from" },
  },
  {
    name: "--exclude-if-present",
    description: "Exclude directories if filename is present",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "exclude-if-present" },
  },
  {
    name: "--expect-continue-timeout",
    description: "Timeout when using expect / 100-continue in HTTP",
    isPersistent: true,
    args: { name: "expect-continue-timeout", default: "1s" },
  },
  {
    name: "--fast-list",
    description:
      "Use recursive list if available; uses more memory but fewer transactions",
    isPersistent: true,
  },
  {
    name: "--fichier-api-key",
    description:
      "Your API Key, get it from https://1fichier.com/console/params.pl",
    isPersistent: true,
    args: { name: "fichier-api-key" },
  },
  {
    name: "--fichier-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "fichier-encoding",
      default:
        "Slash,LtGt,DoubleQuote,SingleQuote,BackQuote,Dollar,BackSlash,Del,Ctl,LeftSpace,RightSpace,InvalidUtf8,Dot",
    },
  },
  {
    name: "--fichier-file-password",
    description:
      "If you want to download a shared file that is password protected, add this parameter (obscured)",
    isPersistent: true,
    args: { name: "fichier-file-password" },
  },
  {
    name: "--fichier-folder-password",
    description:
      "If you want to list the files in a shared folder that is password protected, add this parameter (obscured)",
    isPersistent: true,
    args: { name: "fichier-folder-password" },
  },
  {
    name: "--fichier-shared-folder",
    description: "If you want to download a shared folder, add this parameter",
    isPersistent: true,
    args: { name: "fichier-shared-folder" },
  },
  {
    name: "--filefabric-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "filefabric-encoding",
      default: "Slash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--filefabric-permanent-token",
    description: "Permanent Authentication Token",
    isPersistent: true,
    args: { name: "filefabric-permanent-token" },
  },
  {
    name: "--filefabric-root-folder-id",
    description: "ID of the root folder",
    isPersistent: true,
    args: { name: "filefabric-root-folder-id" },
  },
  {
    name: "--filefabric-token",
    description: "Session Token",
    isPersistent: true,
    args: { name: "filefabric-token" },
  },
  {
    name: "--filefabric-token-expiry",
    description: "Token expiry time",
    isPersistent: true,
    args: { name: "filefabric-token-expiry" },
  },
  {
    name: "--filefabric-url",
    description: "URL of the Enterprise File Fabric to connect to",
    isPersistent: true,
    args: { name: "filefabric-url" },
  },
  {
    name: "--filefabric-version",
    description: "Version read from the file fabric",
    isPersistent: true,
    args: { name: "filefabric-version" },
  },
  {
    name: "--files-from",
    description:
      "Read list of source-file names from file (use - to read from stdin)",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "files-from" },
  },
  {
    name: "--files-from-raw",
    description:
      "Read list of source-file names from file without any processing of lines (use - to read from stdin)",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "files-from-raw" },
  },
  {
    name: ["--filter", "-f"],
    description: "Add a file-filtering rule",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "filter" },
  },
  {
    name: "--filter-from",
    description:
      "Read filtering patterns from a file (use - to read from stdin)",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "filter-from" },
  },
  {
    name: "--fs-cache-expire-duration",
    description: "Cache remotes for this long (0 to disable caching)",
    isPersistent: true,
    args: { name: "fs-cache-expire-duration", default: "5m0s" },
  },
  {
    name: "--fs-cache-expire-interval",
    description: "Interval to check for expired remotes",
    isPersistent: true,
    args: { name: "fs-cache-expire-interval", default: "1m0s" },
  },
  {
    name: "--ftp-ask-password",
    description: "Allow asking for FTP password when needed",
    isPersistent: true,
  },
  {
    name: "--ftp-close-timeout",
    description: "Maximum time to wait for a response to close",
    isPersistent: true,
    args: { name: "ftp-close-timeout", default: "1m0s" },
  },
  {
    name: "--ftp-concurrency",
    description:
      "Maximum number of FTP simultaneous connections, 0 for unlimited",
    isPersistent: true,
    args: { name: "ftp-concurrency", default: "0" },
  },
  {
    name: "--ftp-disable-epsv",
    description: "Disable using EPSV even if server advertises support",
    isPersistent: true,
  },
  {
    name: "--ftp-disable-mlsd",
    description: "Disable using MLSD even if server advertises support",
    isPersistent: true,
  },
  {
    name: "--ftp-disable-tls13",
    description: "Disable TLS 1.3 (workaround for FTP servers with buggy TLS)",
    isPersistent: true,
  },
  {
    name: "--ftp-disable-utf8",
    description: "Disable using UTF-8 even if server advertises support",
    isPersistent: true,
  },
  {
    name: "--ftp-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "ftp-encoding", default: "Slash,Del,Ctl,RightSpace,Dot" },
  },
  {
    name: "--ftp-explicit-tls",
    description: "Use Explicit FTPS (FTP over TLS)",
    isPersistent: true,
  },
  {
    name: "--ftp-host",
    description: "FTP host to connect to",
    isPersistent: true,
    args: { name: "ftp-host" },
  },
  {
    name: "--ftp-idle-timeout",
    description: "Max time before closing idle connections",
    isPersistent: true,
    args: { name: "ftp-idle-timeout", default: "1m0s" },
  },
  {
    name: "--ftp-no-check-certificate",
    description: "Do not verify the TLS certificate of the server",
    isPersistent: true,
  },
  {
    name: "--ftp-pass",
    description: "FTP password (obscured)",
    isPersistent: true,
    args: { name: "ftp-pass" },
  },
  {
    name: "--ftp-port",
    description: "FTP port number",
    isPersistent: true,
    args: { name: "ftp-port", default: "21" },
  },
  {
    name: "--ftp-shut-timeout",
    description: "Maximum time to wait for data connection closing status",
    isPersistent: true,
    args: { name: "ftp-shut-timeout", default: "1m0s" },
  },
  {
    name: "--ftp-tls",
    description: "Use Implicit FTPS (FTP over TLS)",
    isPersistent: true,
  },
  {
    name: "--ftp-tls-cache-size",
    description:
      "Size of TLS session cache for all control and data connections",
    isPersistent: true,
    args: { name: "ftp-tls-cache-size", default: "32" },
  },
  {
    name: "--ftp-user",
    description: "FTP username",
    isPersistent: true,
    args: { name: "ftp-user", default: "ryan" },
  },
  {
    name: "--ftp-writing-mdtm",
    description: "Use MDTM to set modification time (VsFtpd quirk)",
    isPersistent: true,
  },
  {
    name: "--gcs-anonymous",
    description: "Access public buckets and objects without credentials",
    isPersistent: true,
  },
  {
    name: "--gcs-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "gcs-auth-url" },
  },
  {
    name: "--gcs-bucket-acl",
    description: "Access Control List for new buckets",
    isPersistent: true,
    args: { name: "gcs-bucket-acl" },
  },
  {
    name: "--gcs-bucket-policy-only",
    description: "Access checks should use bucket-level IAM policies",
    isPersistent: true,
  },
  {
    name: "--gcs-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "gcs-client-id" },
  },
  {
    name: "--gcs-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "gcs-client-secret" },
  },
  {
    name: "--gcs-decompress",
    description: "If set this will decompress gzip encoded objects",
    isPersistent: true,
  },
  {
    name: "--gcs-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "gcs-encoding", default: "Slash,CrLf,InvalidUtf8,Dot" },
  },
  {
    name: "--gcs-endpoint",
    description: "Endpoint for the service",
    isPersistent: true,
    args: { name: "gcs-endpoint" },
  },
  {
    name: "--gcs-location",
    description: "Location for the newly created buckets",
    isPersistent: true,
    args: { name: "gcs-location" },
  },
  {
    name: "--gcs-no-check-bucket",
    description:
      "If set, don't attempt to check the bucket exists or create it",
    isPersistent: true,
  },
  {
    name: "--gcs-object-acl",
    description: "Access Control List for new objects",
    isPersistent: true,
    args: { name: "gcs-object-acl" },
  },
  {
    name: "--gcs-project-number",
    description: "Project number",
    isPersistent: true,
    args: { name: "gcs-project-number" },
  },
  {
    name: "--gcs-service-account-credentials",
    description: "Service Account Credentials JSON blob",
    isPersistent: true,
    hidden: true,
    args: { name: "gcs-service-account-credentials" },
  },
  {
    name: "--gcs-service-account-file",
    description: "Service Account Credentials JSON file path",
    isPersistent: true,
    args: { name: "gcs-service-account-file" },
  },
  {
    name: "--gcs-storage-class",
    description:
      "The storage class to use when storing objects in Google Cloud Storage",
    isPersistent: true,
    args: { name: "gcs-storage-class" },
  },
  {
    name: "--gcs-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "gcs-token" },
  },
  {
    name: "--gcs-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "gcs-token-url" },
  },
  {
    name: "--gphotos-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "gphotos-auth-url" },
  },
  {
    name: "--gphotos-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "gphotos-client-id" },
  },
  {
    name: "--gphotos-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "gphotos-client-secret" },
  },
  {
    name: "--gphotos-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "gphotos-encoding", default: "Slash,CrLf,InvalidUtf8,Dot" },
  },
  {
    name: "--gphotos-include-archived",
    description: "Also view and download archived media",
    isPersistent: true,
  },
  {
    name: "--gphotos-read-only",
    description: "Set to make the Google Photos backend read only",
    isPersistent: true,
  },
  {
    name: "--gphotos-read-size",
    description: "Set to read the size of media items",
    isPersistent: true,
  },
  {
    name: "--gphotos-start-year",
    description:
      "Year limits the photos to be downloaded to those which are uploaded after the given year",
    isPersistent: true,
    args: { name: "gphotos-start-year", default: "2000" },
  },
  {
    name: "--gphotos-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "gphotos-token" },
  },
  {
    name: "--gphotos-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "gphotos-token-url" },
  },
  {
    name: "--hasher-auto-size",
    description:
      "Auto-update checksum for files smaller than this size (disabled by default)",
    isPersistent: true,
    args: { name: "hasher-auto-size", default: "0" },
  },
  {
    name: "--hasher-hashes",
    description: "Comma separated list of supported checksum types",
    isPersistent: true,
    args: { name: "hasher-hashes", default: "md5,sha1" },
  },
  {
    name: "--hasher-max-age",
    description:
      "Maximum time to keep checksums in cache (0 = no cache, off = cache forever)",
    isPersistent: true,
    args: { name: "hasher-max-age", default: "off" },
  },
  {
    name: "--hasher-remote",
    description: "Remote to cache checksums for (e.g. myRemote:path)",
    isPersistent: true,
    args: { name: "hasher-remote" },
  },
  {
    name: "--hdfs-data-transfer-protection",
    description:
      "Kerberos data transfer protection: authentication|integrity|privacy",
    isPersistent: true,
    args: { name: "hdfs-data-transfer-protection" },
  },
  {
    name: "--hdfs-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "hdfs-encoding",
      default: "Slash,Colon,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--hdfs-namenode",
    description: "Hadoop name node and port",
    isPersistent: true,
    args: { name: "hdfs-namenode" },
  },
  {
    name: "--hdfs-service-principal-name",
    description: "Kerberos service principal name for the namenode",
    isPersistent: true,
    args: { name: "hdfs-service-principal-name" },
  },
  {
    name: "--hdfs-username",
    description: "Hadoop user name",
    isPersistent: true,
    args: { name: "hdfs-username" },
  },
  {
    name: "--header",
    description: "Set HTTP header for all transactions",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "header" },
  },
  {
    name: "--header-download",
    description: "Set HTTP header for download transactions",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "header-download" },
  },
  {
    name: "--header-upload",
    description: "Set HTTP header for upload transactions",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "header-upload" },
  },
  {
    name: "--hidrive-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "hidrive-auth-url" },
  },
  {
    name: "--hidrive-chunk-size",
    description: "Chunksize for chunked uploads",
    isPersistent: true,
    args: { name: "hidrive-chunk-size", default: "48Mi" },
  },
  {
    name: "--hidrive-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "hidrive-client-id" },
  },
  {
    name: "--hidrive-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "hidrive-client-secret" },
  },
  {
    name: "--hidrive-disable-fetching-member-count",
    description:
      "Do not fetch number of objects in directories unless it is absolutely necessary",
    isPersistent: true,
  },
  {
    name: "--hidrive-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "hidrive-encoding", default: "Slash,Dot" },
  },
  {
    name: "--hidrive-endpoint",
    description: "Endpoint for the service",
    isPersistent: true,
    args: {
      name: "hidrive-endpoint",
      default: "https://api.hidrive.strato.com/2.1",
    },
  },
  {
    name: "--hidrive-root-prefix",
    description: "The root/parent folder for all paths",
    isPersistent: true,
    args: { name: "hidrive-root-prefix", default: "/" },
  },
  {
    name: "--hidrive-scope-access",
    description:
      "Access permissions that rclone should use when requesting access from HiDrive",
    isPersistent: true,
    args: { name: "hidrive-scope-access", default: "rw" },
  },
  {
    name: "--hidrive-scope-role",
    description:
      "User-level that rclone should use when requesting access from HiDrive",
    isPersistent: true,
    args: { name: "hidrive-scope-role", default: "user" },
  },
  {
    name: "--hidrive-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "hidrive-token" },
  },
  {
    name: "--hidrive-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "hidrive-token-url" },
  },
  {
    name: "--hidrive-upload-concurrency",
    description: "Concurrency for chunked uploads",
    isPersistent: true,
    args: { name: "hidrive-upload-concurrency", default: "4" },
  },
  {
    name: "--hidrive-upload-cutoff",
    description: "Cutoff/Threshold for chunked uploads",
    isPersistent: true,
    args: { name: "hidrive-upload-cutoff", default: "96Mi" },
  },
  {
    name: "--http-headers",
    description: "Set HTTP headers for all transactions",
    isPersistent: true,
    args: { name: "http-headers" },
  },
  {
    name: "--http-no-head",
    description: "Don't use HEAD requests",
    isPersistent: true,
  },
  {
    name: "--http-no-slash",
    description: "Set this if the site doesn't end directories with /",
    isPersistent: true,
  },
  {
    name: "--http-url",
    description: "URL of HTTP host to connect to",
    isPersistent: true,
    args: { name: "http-url" },
  },
  {
    name: "--hubic-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "hubic-auth-url" },
  },
  {
    name: "--hubic-chunk-size",
    description:
      "Above this size files will be chunked into a _segments container",
    isPersistent: true,
    args: { name: "hubic-chunk-size", default: "5Gi" },
  },
  {
    name: "--hubic-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "hubic-client-id" },
  },
  {
    name: "--hubic-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "hubic-client-secret" },
  },
  {
    name: "--hubic-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "hubic-encoding", default: "Slash,InvalidUtf8" },
  },
  {
    name: "--hubic-no-chunk",
    description: "Don't chunk files during streaming upload",
    isPersistent: true,
  },
  {
    name: "--hubic-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "hubic-token" },
  },
  {
    name: "--hubic-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "hubic-token-url" },
  },
  {
    name: "--human-readable",
    description:
      "Print numbers in a human-readable format, sizes with suffix Ki|Mi|Gi|Ti|Pi",
    isPersistent: true,
  },
  {
    name: "--ignore-case",
    description: "Ignore case in filters (case insensitive)",
    isPersistent: true,
  },
  {
    name: "--ignore-case-sync",
    description: "Ignore case when synchronizing",
    isPersistent: true,
  },
  {
    name: "--ignore-checksum",
    description: "Skip post copy check of checksums",
    isPersistent: true,
  },
  {
    name: "--ignore-errors",
    description: "Delete even if there are I/O errors",
    isPersistent: true,
  },
  {
    name: "--ignore-existing",
    description: "Skip all files that exist on destination",
    isPersistent: true,
  },
  {
    name: "--ignore-size",
    description: "Ignore size when skipping use mod-time or checksum",
    isPersistent: true,
  },
  {
    name: ["--ignore-times", "-I"],
    description:
      "Don't skip files that match size and time - transfer all files",
    isPersistent: true,
  },
  {
    name: "--immutable",
    description:
      "Do not modify files, fail if existing files have been modified",
    isPersistent: true,
  },
  {
    name: "--include",
    description: "Include files matching pattern",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "include" },
  },
  {
    name: "--include-from",
    description: "Read include patterns from file (use - to read from stdin)",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "include-from" },
  },
  {
    name: ["--interactive", "-i"],
    description: "Enable interactive mode",
    isPersistent: true,
  },
  {
    name: "--internetarchive-access-key-id",
    description: "IAS3 Access Key",
    isPersistent: true,
    args: { name: "internetarchive-access-key-id" },
  },
  {
    name: "--internetarchive-disable-checksum",
    description:
      "Don't ask the server to test against MD5 checksum calculated by rclone",
    isPersistent: true,
  },
  {
    name: "--internetarchive-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "internetarchive-encoding",
      default: "Slash,LtGt,CrLf,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--internetarchive-endpoint",
    description: "IAS3 Endpoint",
    isPersistent: true,
    args: {
      name: "internetarchive-endpoint",
      default: "https://s3.us.archive.org",
    },
  },
  {
    name: "--internetarchive-front-endpoint",
    description: "Host of InternetArchive Frontend",
    isPersistent: true,
    args: {
      name: "internetarchive-front-endpoint",
      default: "https://archive.org",
    },
  },
  {
    name: "--internetarchive-secret-access-key",
    description: "IAS3 Secret Key (password)",
    isPersistent: true,
    args: { name: "internetarchive-secret-access-key" },
  },
  {
    name: "--internetarchive-wait-archive",
    description:
      "Timeout for waiting the server's processing tasks (specifically archive and book_op) to finish",
    isPersistent: true,
    args: { name: "internetarchive-wait-archive", default: "0s" },
  },
  {
    name: "--jottacloud-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "jottacloud-encoding",
      default:
        "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--jottacloud-hard-delete",
    description:
      "Delete files permanently rather than putting them into the trash",
    isPersistent: true,
  },
  {
    name: "--jottacloud-md5-memory-limit",
    description:
      "Files bigger than this will be cached on disk to calculate the MD5 if required",
    isPersistent: true,
    args: { name: "jottacloud-md5-memory-limit", default: "10Mi" },
  },
  {
    name: "--jottacloud-no-versions",
    description:
      "Avoid server side versioning by deleting files and recreating files instead of overwriting them",
    isPersistent: true,
  },
  {
    name: "--jottacloud-trashed-only",
    description: "Only show files that are in the trash",
    isPersistent: true,
  },
  {
    name: "--jottacloud-upload-resume-limit",
    description: "Files bigger than this can be resumed if the upload fail's",
    isPersistent: true,
    args: { name: "jottacloud-upload-resume-limit", default: "10Mi" },
  },
  {
    name: "--koofr-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "koofr-encoding",
      default: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--koofr-endpoint",
    description: "The Koofr API endpoint to use",
    isPersistent: true,
    args: { name: "koofr-endpoint" },
  },
  {
    name: "--koofr-mountid",
    description: "Mount ID of the mount to use",
    isPersistent: true,
    args: { name: "koofr-mountid" },
  },
  {
    name: "--koofr-password",
    description:
      "Your password for rclone (generate one at https://app.koofr.net/app/admin/preferences/password) (obscured)",
    isPersistent: true,
    args: { name: "koofr-password" },
  },
  {
    name: "--koofr-provider",
    description: "Choose your storage provider",
    isPersistent: true,
    args: { name: "koofr-provider" },
  },
  {
    name: "--koofr-setmtime",
    description: "Does the backend support setting modification time",
    isPersistent: true,
  },
  {
    name: "--koofr-user",
    description: "Your user name",
    isPersistent: true,
    args: { name: "koofr-user" },
  },
  {
    name: "--kv-lock-time",
    description: "Maximum time to keep key-value database locked by process",
    isPersistent: true,
    args: { name: "kv-lock-time", default: "1s" },
  },
  {
    name: ["--links", "-l"],
    description:
      "Translate symlinks to/from regular files with a '.rclonelink' extension",
    isPersistent: true,
  },
  {
    name: "--local-case-insensitive",
    description: "Force the filesystem to report itself as case insensitive",
    isPersistent: true,
  },
  {
    name: "--local-case-sensitive",
    description: "Force the filesystem to report itself as case sensitive",
    isPersistent: true,
  },
  {
    name: "--local-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "local-encoding", default: "Slash,InvalidUtf8,Dot" },
  },
  {
    name: "--local-no-check-updated",
    description: "Don't check to see if the files change during upload",
    isPersistent: true,
  },
  {
    name: "--local-no-preallocate",
    description: "Disable preallocation of disk space for transferred files",
    isPersistent: true,
  },
  {
    name: "--local-no-set-modtime",
    description: "Disable setting modtime",
    isPersistent: true,
  },
  {
    name: "--local-no-sparse",
    description: "Disable sparse files for multi-thread downloads",
    isPersistent: true,
  },
  {
    name: "--local-nounc",
    description: "Disable UNC (long path names) conversion on Windows",
    isPersistent: true,
  },
  {
    name: "--local-unicode-normalization",
    description: "Apply unicode NFC normalization to paths and filenames",
    isPersistent: true,
  },
  {
    name: "--local-zero-size-links",
    description:
      "Assume the Stat size of links is zero (and read them instead) (deprecated)",
    isPersistent: true,
  },
  {
    name: "--log-file",
    description: "Log everything to this file",
    isPersistent: true,
    args: { name: "log-file" },
  },
  {
    name: "--log-format",
    description: "Comma separated list of log format options",
    isPersistent: true,
    args: { name: "log-format", default: "date,time" },
  },
  {
    name: "--log-level",
    description: "Log level DEBUG|INFO|NOTICE|ERROR",
    isPersistent: true,
    args: { name: "log-level", default: "NOTICE" },
  },
  {
    name: "--log-systemd",
    description: "Activate systemd integration for the logger",
    isPersistent: true,
  },
  {
    name: "--low-level-retries",
    description: "Number of low level retries to do",
    isPersistent: true,
    args: { name: "low-level-retries", default: "10" },
  },
  {
    name: "--mailru-check-hash",
    description:
      "What should copy do if file checksum is mismatched or invalid",
    isPersistent: true,
  },
  {
    name: "--mailru-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "mailru-encoding",
      default:
        "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--mailru-pass",
    description: "Password (obscured)",
    isPersistent: true,
    args: { name: "mailru-pass" },
  },
  {
    name: "--mailru-quirks",
    description: "Comma separated list of internal maintenance flags",
    isPersistent: true,
    hidden: true,
    args: { name: "mailru-quirks" },
  },
  {
    name: "--mailru-speedup-enable",
    description:
      "Skip full upload if there is another file with same data hash",
    isPersistent: true,
  },
  {
    name: "--mailru-speedup-file-patterns",
    description:
      "Comma separated list of file name patterns eligible for speedup (put by hash)",
    isPersistent: true,
    args: {
      name: "mailru-speedup-file-patterns",
      default: "*.mkv,*.avi,*.mp4,*.mp3,*.zip,*.gz,*.rar,*.pdf",
    },
  },
  {
    name: "--mailru-speedup-max-disk",
    description:
      "This option allows you to disable speedup (put by hash) for large files",
    isPersistent: true,
    args: { name: "mailru-speedup-max-disk", default: "3Gi" },
  },
  {
    name: "--mailru-speedup-max-memory",
    description:
      "Files larger than the size given below will always be hashed on disk",
    isPersistent: true,
    args: { name: "mailru-speedup-max-memory", default: "32Mi" },
  },
  {
    name: "--mailru-user",
    description: "User name (usually email)",
    isPersistent: true,
    args: { name: "mailru-user" },
  },
  {
    name: "--mailru-user-agent",
    description: "HTTP user agent used internally by client",
    isPersistent: true,
    hidden: true,
    args: { name: "mailru-user-agent" },
  },
  {
    name: "--max-age",
    description:
      "Only transfer files younger than this in s or suffix ms|s|m|h|d|w|M|y",
    isPersistent: true,
    args: { name: "max-age", default: "off" },
  },
  {
    name: "--max-backlog",
    description: "Maximum number of objects in sync or check backlog",
    isPersistent: true,
    args: { name: "max-backlog", default: "10000" },
  },
  {
    name: "--max-delete",
    description: "When synchronizing, limit the number of deletes",
    isPersistent: true,
    args: { name: "max-delete", default: "-1" },
  },
  {
    name: "--max-depth",
    description: "If set limits the recursion depth to this",
    isPersistent: true,
    args: { name: "max-depth", default: "-1" },
  },
  {
    name: "--max-duration",
    description: "Maximum duration rclone will transfer data for",
    isPersistent: true,
    args: { name: "max-duration", default: "0s" },
  },
  {
    name: "--max-size",
    description:
      "Only transfer files smaller than this in KiB or suffix B|K|M|G|T|P",
    isPersistent: true,
    args: { name: "max-size", default: "off" },
  },
  {
    name: "--max-stats-groups",
    description:
      "Maximum number of stats groups to keep in memory, on max oldest is discarded",
    isPersistent: true,
    args: { name: "max-stats-groups", default: "1000" },
  },
  {
    name: "--max-transfer",
    description: "Maximum size of data to transfer",
    isPersistent: true,
    args: { name: "max-transfer", default: "off" },
  },
  {
    name: "--mega-debug",
    description: "Output more debug from Mega",
    isPersistent: true,
  },
  {
    name: "--mega-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "mega-encoding", default: "Slash,InvalidUtf8,Dot" },
  },
  {
    name: "--mega-hard-delete",
    description:
      "Delete files permanently rather than putting them into the trash",
    isPersistent: true,
  },
  {
    name: "--mega-pass",
    description: "Password (obscured)",
    isPersistent: true,
    args: { name: "mega-pass" },
  },
  {
    name: "--mega-user",
    description: "User name",
    isPersistent: true,
    args: { name: "mega-user" },
  },
  {
    name: "--memprofile",
    description: "Write memory profile to file",
    isPersistent: true,
    args: { name: "memprofile" },
  },
  {
    name: ["--metadata", "-M"],
    description: "If set, preserve metadata when copying objects",
    isPersistent: true,
  },
  {
    name: "--metadata-set",
    description: "Add metadata key=value when uploading",
    isPersistent: true,
    isRepeatable: true,
    args: { name: "metadata-set" },
  },
  {
    name: "--min-age",
    description:
      "Only transfer files older than this in s or suffix ms|s|m|h|d|w|M|y",
    isPersistent: true,
    args: { name: "min-age", default: "off" },
  },
  {
    name: "--min-size",
    description:
      "Only transfer files bigger than this in KiB or suffix B|K|M|G|T|P",
    isPersistent: true,
    args: { name: "min-size", default: "off" },
  },
  {
    name: "--modify-window",
    description: "Max time diff to be considered the same",
    isPersistent: true,
    args: { name: "modify-window", default: "1ns" },
  },
  {
    name: "--multi-thread-cutoff",
    description: "Use multi-thread downloads for files above this size",
    isPersistent: true,
    args: { name: "multi-thread-cutoff", default: "250Mi" },
  },
  {
    name: "--multi-thread-streams",
    description: "Max number of streams to use for multi-thread downloads",
    isPersistent: true,
    args: { name: "multi-thread-streams", default: "4" },
  },
  {
    name: "--netstorage-account",
    description: "Set the NetStorage account name",
    isPersistent: true,
    args: { name: "netstorage-account" },
  },
  {
    name: "--netstorage-host",
    description: "Domain+path of NetStorage host to connect to",
    isPersistent: true,
    args: { name: "netstorage-host" },
  },
  {
    name: "--netstorage-protocol",
    description: "Select between HTTP or HTTPS protocol",
    isPersistent: true,
    args: { name: "netstorage-protocol", default: "https" },
  },
  {
    name: "--netstorage-secret",
    description:
      "Set the NetStorage account secret/G2O key for authentication (obscured)",
    isPersistent: true,
    args: { name: "netstorage-secret" },
  },
  {
    name: "--no-check-certificate",
    description: "Do not verify the server SSL certificate (insecure)",
    isPersistent: true,
  },
  {
    name: "--no-check-dest",
    description: "Don't check the destination, copy regardless",
    isPersistent: true,
  },
  {
    name: "--no-console",
    description: "Hide console window (supported on Windows only)",
    isPersistent: true,
  },
  {
    name: "--no-gzip-encoding",
    description: "Don't set Accept-Encoding: gzip",
    isPersistent: true,
  },
  {
    name: "--no-traverse",
    description: "Don't traverse destination file system on copy",
    isPersistent: true,
  },
  {
    name: "--no-unicode-normalization",
    description: "Don't normalize unicode characters in filenames",
    isPersistent: true,
  },
  {
    name: "--no-update-modtime",
    description: "Don't update destination mod-time if files identical",
    isPersistent: true,
  },
  {
    name: ["--one-file-system", "-x"],
    description: "Don't cross filesystem boundaries (unix/macOS only)",
    isPersistent: true,
  },
  {
    name: "--onedrive-access-scopes",
    description: "Set scopes to be requested by rclone",
    isPersistent: true,
    args: {
      name: "onedrive-access-scopes",
      default:
        "Files.Read Files.ReadWrite Files.Read.All Files.ReadWrite.All Sites.Read.All offline_access",
    },
  },
  {
    name: "--onedrive-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "onedrive-auth-url" },
  },
  {
    name: "--onedrive-chunk-size",
    description:
      "Chunk size to upload files with - must be multiple of 320k (327,680 bytes)",
    isPersistent: true,
    args: { name: "onedrive-chunk-size", default: "10Mi" },
  },
  {
    name: "--onedrive-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "onedrive-client-id" },
  },
  {
    name: "--onedrive-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "onedrive-client-secret" },
  },
  {
    name: "--onedrive-disable-site-permission",
    description: "Disable the request for Sites.Read.All permission",
    isPersistent: true,
    hidden: true,
  },
  {
    name: "--onedrive-drive-id",
    description: "The ID of the drive to use",
    isPersistent: true,
    args: { name: "onedrive-drive-id" },
  },
  {
    name: "--onedrive-drive-type",
    description:
      "The type of the drive (personal | business | documentLibrary)",
    isPersistent: true,
    args: { name: "onedrive-drive-type" },
  },
  {
    name: "--onedrive-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "onedrive-encoding",
      default:
        "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Del,Ctl,LeftSpace,LeftTilde,RightSpace,RightPeriod,InvalidUtf8,Dot",
    },
  },
  {
    name: "--onedrive-expose-onenote-files",
    description: "Set to make OneNote files show up in directory listings",
    isPersistent: true,
  },
  {
    name: "--onedrive-link-password",
    description: "Set the password for links created by the link command",
    isPersistent: true,
    args: { name: "onedrive-link-password" },
  },
  {
    name: "--onedrive-link-scope",
    description: "Set the scope of the links created by the link command",
    isPersistent: true,
    args: { name: "onedrive-link-scope", default: "anonymous" },
  },
  {
    name: "--onedrive-link-type",
    description: "Set the type of the links created by the link command",
    isPersistent: true,
    args: { name: "onedrive-link-type", default: "view" },
  },
  {
    name: "--onedrive-list-chunk",
    description: "Size of listing chunk",
    isPersistent: true,
    args: { name: "onedrive-list-chunk", default: "1000" },
  },
  {
    name: "--onedrive-no-versions",
    description: "Remove all versions on modifying operations",
    isPersistent: true,
  },
  {
    name: "--onedrive-region",
    description: "Choose national cloud region for OneDrive",
    isPersistent: true,
    args: { name: "onedrive-region", default: "global" },
  },
  {
    name: "--onedrive-root-folder-id",
    description: "ID of the root folder",
    isPersistent: true,
    args: { name: "onedrive-root-folder-id" },
  },
  {
    name: "--onedrive-server-side-across-configs",
    description:
      "Allow server-side operations (e.g. copy) to work across different onedrive configs",
    isPersistent: true,
  },
  {
    name: "--onedrive-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "onedrive-token" },
  },
  {
    name: "--onedrive-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "onedrive-token-url" },
  },
  {
    name: "--opendrive-chunk-size",
    description: "Files will be uploaded in chunks this size",
    isPersistent: true,
    args: { name: "opendrive-chunk-size", default: "10Mi" },
  },
  {
    name: "--opendrive-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "opendrive-encoding",
      default:
        "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,LeftSpace,LeftCrLfHtVt,RightSpace,RightCrLfHtVt,InvalidUtf8,Dot",
    },
  },
  {
    name: "--opendrive-password",
    description: "Password (obscured)",
    isPersistent: true,
    args: { name: "opendrive-password" },
  },
  {
    name: "--opendrive-username",
    description: "Username",
    isPersistent: true,
    args: { name: "opendrive-username" },
  },
  {
    name: "--order-by",
    description:
      "Instructions on how to order the transfers, e.g. 'size,descending'",
    isPersistent: true,
    args: { name: "order-by" },
  },
  {
    name: "--password-command",
    description: "Command for supplying password for encrypted configuration",
    isPersistent: true,
    args: { name: "password-command" },
  },
  {
    name: "--pcloud-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "pcloud-auth-url" },
  },
  {
    name: "--pcloud-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "pcloud-client-id" },
  },
  {
    name: "--pcloud-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "pcloud-client-secret" },
  },
  {
    name: "--pcloud-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "pcloud-encoding",
      default: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--pcloud-hostname",
    description: "Hostname to connect to",
    isPersistent: true,
    args: { name: "pcloud-hostname", default: "api.pcloud.com" },
  },
  {
    name: "--pcloud-password",
    description: "Your pcloud password (obscured)",
    isPersistent: true,
    args: { name: "pcloud-password" },
  },
  {
    name: "--pcloud-root-folder-id",
    description:
      "Fill in for rclone to use a non root folder as its starting point",
    isPersistent: true,
    args: { name: "pcloud-root-folder-id", default: "d0" },
  },
  {
    name: "--pcloud-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "pcloud-token" },
  },
  {
    name: "--pcloud-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "pcloud-token-url" },
  },
  {
    name: "--pcloud-username",
    description: "Your pcloud username",
    isPersistent: true,
    args: { name: "pcloud-username" },
  },
  {
    name: "--premiumizeme-api-key",
    description: "API Key",
    isPersistent: true,
    hidden: true,
    args: { name: "premiumizeme-api-key" },
  },
  {
    name: "--premiumizeme-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "premiumizeme-encoding",
      default: "Slash,DoubleQuote,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: ["--progress", "-P"],
    description: "Show progress during transfer",
    isPersistent: true,
  },
  {
    name: "--progress-terminal-title",
    description: "Show progress on the terminal title (requires -P/--progress)",
    isPersistent: true,
  },
  {
    name: "--putio-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "putio-encoding",
      default: "Slash,BackSlash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--qingstor-access-key-id",
    description: "QingStor Access Key ID",
    isPersistent: true,
    args: { name: "qingstor-access-key-id" },
  },
  {
    name: "--qingstor-chunk-size",
    description: "Chunk size to use for uploading",
    isPersistent: true,
    args: { name: "qingstor-chunk-size", default: "4Mi" },
  },
  {
    name: "--qingstor-connection-retries",
    description: "Number of connection retries",
    isPersistent: true,
    args: { name: "qingstor-connection-retries", default: "3" },
  },
  {
    name: "--qingstor-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "qingstor-encoding", default: "Slash,Ctl,InvalidUtf8" },
  },
  {
    name: "--qingstor-endpoint",
    description: "Enter an endpoint URL to connection QingStor API",
    isPersistent: true,
    args: { name: "qingstor-endpoint" },
  },
  {
    name: "--qingstor-env-auth",
    description: "Get QingStor credentials from runtime",
    isPersistent: true,
  },
  {
    name: "--qingstor-secret-access-key",
    description: "QingStor Secret Access Key (password)",
    isPersistent: true,
    args: { name: "qingstor-secret-access-key" },
  },
  {
    name: "--qingstor-upload-concurrency",
    description: "Concurrency for multipart uploads",
    isPersistent: true,
    args: { name: "qingstor-upload-concurrency", default: "1" },
  },
  {
    name: "--qingstor-upload-cutoff",
    description: "Cutoff for switching to chunked upload",
    isPersistent: true,
    args: { name: "qingstor-upload-cutoff", default: "200Mi" },
  },
  {
    name: "--qingstor-zone",
    description: "Zone to connect to",
    isPersistent: true,
    args: { name: "qingstor-zone" },
  },
  {
    name: ["--quiet", "-q"],
    description: "Print as little stuff as possible",
    isPersistent: true,
  },
  {
    name: "--rc",
    description: "Enable the remote control server",
    isPersistent: true,
  },
  {
    name: "--rc-addr",
    description: "IPaddress:Port or :Port to bind server to",
    isPersistent: true,
    args: { name: "rc-addr", default: "localhost:5572" },
  },
  {
    name: "--rc-allow-origin",
    description: "Set the allowed origin for CORS",
    isPersistent: true,
    args: { name: "rc-allow-origin" },
  },
  {
    name: "--rc-baseurl",
    description: "Prefix for URLs - leave blank for root",
    isPersistent: true,
    args: { name: "rc-baseurl" },
  },
  {
    name: "--rc-cert",
    description:
      "SSL PEM key (concatenation of certificate and CA certificate)",
    isPersistent: true,
    args: { name: "rc-cert" },
  },
  {
    name: "--rc-client-ca",
    description: "Client certificate authority to verify clients with",
    isPersistent: true,
    args: { name: "rc-client-ca" },
  },
  {
    name: "--rc-enable-metrics",
    description: "Enable prometheus metrics on /metrics",
    isPersistent: true,
  },
  {
    name: "--rc-files",
    description: "Path to local files to serve on the HTTP server",
    isPersistent: true,
    args: { name: "rc-files" },
  },
  {
    name: "--rc-htpasswd",
    description: "Htpasswd file - if not provided no authentication is done",
    isPersistent: true,
    args: { name: "rc-htpasswd" },
  },
  {
    name: "--rc-job-expire-duration",
    description: "Expire finished async jobs older than this value",
    isPersistent: true,
    args: { name: "rc-job-expire-duration", default: "1m0s" },
  },
  {
    name: "--rc-job-expire-interval",
    description: "Interval to check for expired async jobs",
    isPersistent: true,
    args: { name: "rc-job-expire-interval", default: "10s" },
  },
  {
    name: "--rc-key",
    description: "SSL PEM Private key",
    isPersistent: true,
    args: { name: "rc-key" },
  },
  {
    name: "--rc-max-header-bytes",
    description: "Maximum size of request header",
    isPersistent: true,
    args: { name: "rc-max-header-bytes", default: "4096" },
  },
  {
    name: "--rc-no-auth",
    description: "Don't require auth for certain methods",
    isPersistent: true,
  },
  {
    name: "--rc-pass",
    description: "Password for authentication",
    isPersistent: true,
    args: { name: "rc-pass" },
  },
  {
    name: "--rc-realm",
    description: "Realm for authentication",
    isPersistent: true,
    args: { name: "rc-realm", default: "rclone" },
  },
  {
    name: "--rc-serve",
    description: "Enable the serving of remote objects",
    isPersistent: true,
  },
  {
    name: "--rc-server-read-timeout",
    description: "Timeout for server reading data",
    isPersistent: true,
    args: { name: "rc-server-read-timeout", default: "1h0m0s" },
  },
  {
    name: "--rc-server-write-timeout",
    description: "Timeout for server writing data",
    isPersistent: true,
    args: { name: "rc-server-write-timeout", default: "1h0m0s" },
  },
  {
    name: "--rc-template",
    description: "User-specified template",
    isPersistent: true,
    args: { name: "rc-template" },
  },
  {
    name: "--rc-user",
    description: "User name for authentication",
    isPersistent: true,
    args: { name: "rc-user" },
  },
  {
    name: "--rc-web-fetch-url",
    description: "URL to fetch the releases for webgui",
    isPersistent: true,
    args: {
      name: "rc-web-fetch-url",
      default:
        "https://api.github.com/repos/rclone/rclone-webui-react/releases/latest",
    },
  },
  {
    name: "--rc-web-gui",
    description: "Launch WebGUI on localhost",
    isPersistent: true,
  },
  {
    name: "--rc-web-gui-force-update",
    description: "Force update to latest version of web gui",
    isPersistent: true,
  },
  {
    name: "--rc-web-gui-no-open-browser",
    description: "Don't open the browser automatically",
    isPersistent: true,
  },
  {
    name: "--rc-web-gui-update",
    description: "Check and update to latest version of web gui",
    isPersistent: true,
  },
  {
    name: "--refresh-times",
    description: "Refresh the modtime of remote files",
    isPersistent: true,
  },
  {
    name: "--retries",
    description: "Retry operations this many times if they fail",
    isPersistent: true,
    args: { name: "retries", default: "3" },
  },
  {
    name: "--retries-sleep",
    description:
      "Interval between retrying operations if they fail, e.g. 500ms, 60s, 5m (0 to disable)",
    isPersistent: true,
    args: { name: "retries-sleep", default: "0s" },
  },
  {
    name: "--s3-access-key-id",
    description: "AWS Access Key ID",
    isPersistent: true,
    args: { name: "s3-access-key-id" },
  },
  {
    name: "--s3-acl",
    description:
      "Canned ACL used when creating buckets and storing or copying objects",
    isPersistent: true,
    args: { name: "s3-acl" },
  },
  {
    name: "--s3-bucket-acl",
    description: "Canned ACL used when creating buckets",
    isPersistent: true,
    args: { name: "s3-bucket-acl" },
  },
  {
    name: "--s3-chunk-size",
    description: "Chunk size to use for uploading",
    isPersistent: true,
    args: { name: "s3-chunk-size", default: "5Mi" },
  },
  {
    name: "--s3-copy-cutoff",
    description: "Cutoff for switching to multipart copy",
    isPersistent: true,
    args: { name: "s3-copy-cutoff", default: "4.656Gi" },
  },
  {
    name: "--s3-decompress",
    description: "If set this will decompress gzip encoded objects",
    isPersistent: true,
  },
  {
    name: "--s3-disable-checksum",
    description: "Don't store MD5 checksum with object metadata",
    isPersistent: true,
  },
  {
    name: "--s3-disable-http2",
    description: "Disable usage of http2 for S3 backends",
    isPersistent: true,
  },
  {
    name: "--s3-download-url",
    description: "Custom endpoint for downloads",
    isPersistent: true,
    args: { name: "s3-download-url" },
  },
  {
    name: "--s3-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "s3-encoding", default: "Slash,InvalidUtf8,Dot" },
  },
  {
    name: "--s3-endpoint",
    description: "Endpoint for S3 API",
    isPersistent: true,
    args: { name: "s3-endpoint" },
  },
  {
    name: "--s3-env-auth",
    description:
      "Get AWS credentials from runtime (environment variables or EC2/ECS meta data if no env vars)",
    isPersistent: true,
  },
  {
    name: "--s3-force-path-style",
    description:
      "If true use path style access if false use virtual hosted style",
    isPersistent: true,
  },
  {
    name: "--s3-leave-parts-on-error",
    description:
      "If true avoid calling abort upload on a failure, leaving all successfully uploaded parts on S3 for manual recovery",
    isPersistent: true,
  },
  {
    name: "--s3-list-chunk",
    description:
      "Size of listing chunk (response list for each ListObject S3 request)",
    isPersistent: true,
    args: { name: "s3-list-chunk", default: "1000" },
  },
  {
    name: "--s3-list-url-encode",
    description: "Whether to url encode listings: true/false/unset",
    isPersistent: true,
    args: { name: "s3-list-url-encode", default: "unset" },
  },
  {
    name: "--s3-list-version",
    description: "Version of ListObjects to use: 1,2 or 0 for auto",
    isPersistent: true,
    args: { name: "s3-list-version", default: "0" },
  },
  {
    name: "--s3-location-constraint",
    description: "Location constraint - must be set to match the Region",
    isPersistent: true,
    args: { name: "s3-location-constraint" },
  },
  {
    name: "--s3-max-upload-parts",
    description: "Maximum number of parts in a multipart upload",
    isPersistent: true,
    args: { name: "s3-max-upload-parts", default: "10000" },
  },
  {
    name: "--s3-memory-pool-flush-time",
    description: "How often internal memory buffer pools will be flushed",
    isPersistent: true,
    args: { name: "s3-memory-pool-flush-time", default: "1m0s" },
  },
  {
    name: "--s3-memory-pool-use-mmap",
    description: "Whether to use mmap buffers in internal memory pool",
    isPersistent: true,
  },
  {
    name: "--s3-no-check-bucket",
    description:
      "If set, don't attempt to check the bucket exists or create it",
    isPersistent: true,
  },
  {
    name: "--s3-no-head",
    description: "If set, don't HEAD uploaded objects to check integrity",
    isPersistent: true,
  },
  {
    name: "--s3-no-head-object",
    description: "If set, do not do HEAD before GET when getting objects",
    isPersistent: true,
  },
  {
    name: "--s3-profile",
    description: "Profile to use in the shared credentials file",
    isPersistent: true,
    args: { name: "s3-profile" },
  },
  {
    name: "--s3-provider",
    description: "Choose your S3 provider",
    isPersistent: true,
    args: { name: "s3-provider" },
  },
  {
    name: "--s3-region",
    description: "Region to connect to",
    isPersistent: true,
    args: { name: "s3-region" },
  },
  {
    name: "--s3-requester-pays",
    description:
      "Enables requester pays option when interacting with S3 bucket",
    isPersistent: true,
  },
  {
    name: "--s3-secret-access-key",
    description: "AWS Secret Access Key (password)",
    isPersistent: true,
    args: { name: "s3-secret-access-key" },
  },
  {
    name: "--s3-server-side-encryption",
    description:
      "The server-side encryption algorithm used when storing this object in S3",
    isPersistent: true,
    args: { name: "s3-server-side-encryption" },
  },
  {
    name: "--s3-session-token",
    description: "An AWS session token",
    isPersistent: true,
    args: { name: "s3-session-token" },
  },
  {
    name: "--s3-shared-credentials-file",
    description: "Path to the shared credentials file",
    isPersistent: true,
    args: { name: "s3-shared-credentials-file" },
  },
  {
    name: "--s3-sse-customer-algorithm",
    description:
      "If using SSE-C, the server-side encryption algorithm used when storing this object in S3",
    isPersistent: true,
    args: { name: "s3-sse-customer-algorithm" },
  },
  {
    name: "--s3-sse-customer-key",
    description:
      "If using SSE-C you must provide the secret encryption key used to encrypt/decrypt your data",
    isPersistent: true,
    args: { name: "s3-sse-customer-key" },
  },
  {
    name: "--s3-sse-customer-key-md5",
    description:
      "If using SSE-C you may provide the secret encryption key MD5 checksum (optional)",
    isPersistent: true,
    args: { name: "s3-sse-customer-key-md5" },
  },
  {
    name: "--s3-sse-kms-key-id",
    description: "If using KMS ID you must provide the ARN of Key",
    isPersistent: true,
    args: { name: "s3-sse-kms-key-id" },
  },
  {
    name: "--s3-storage-class",
    description: "The storage class to use when storing new objects in S3",
    isPersistent: true,
    args: { name: "s3-storage-class" },
  },
  {
    name: "--s3-upload-concurrency",
    description: "Concurrency for multipart uploads",
    isPersistent: true,
    args: { name: "s3-upload-concurrency", default: "4" },
  },
  {
    name: "--s3-upload-cutoff",
    description: "Cutoff for switching to chunked upload",
    isPersistent: true,
    args: { name: "s3-upload-cutoff", default: "200Mi" },
  },
  {
    name: "--s3-use-accelerate-endpoint",
    description: "If true use the AWS S3 accelerated endpoint",
    isPersistent: true,
  },
  {
    name: "--s3-use-multipart-etag",
    description: "Whether to use ETag in multipart uploads for verification",
    isPersistent: true,
    args: { name: "s3-use-multipart-etag", default: "unset" },
  },
  {
    name: "--s3-use-presigned-request",
    description:
      "Whether to use a presigned request or PutObject for single part uploads",
    isPersistent: true,
  },
  {
    name: "--s3-v2-auth",
    description: "If true use v2 authentication",
    isPersistent: true,
  },
  {
    name: "--s3-version-at",
    description: "Show file versions as they were at the specified time",
    isPersistent: true,
    args: { name: "s3-version-at", default: "off" },
  },
  {
    name: "--s3-versions",
    description: "Include old versions in directory listings",
    isPersistent: true,
  },
  {
    name: "--seafile-2fa",
    description:
      "Two-factor authentication ('true' if the account has 2FA enabled)",
    isPersistent: true,
  },
  {
    name: "--seafile-auth-token",
    description: "Authentication token",
    isPersistent: true,
    hidden: true,
    args: { name: "seafile-auth-token" },
  },
  {
    name: "--seafile-create-library",
    description: "Should rclone create a library if it doesn't exist",
    isPersistent: true,
  },
  {
    name: "--seafile-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "seafile-encoding",
      default: "Slash,DoubleQuote,BackSlash,Ctl,InvalidUtf8",
    },
  },
  {
    name: "--seafile-library",
    description: "Name of the library",
    isPersistent: true,
    args: { name: "seafile-library" },
  },
  {
    name: "--seafile-library-key",
    description: "Library password (for encrypted libraries only) (obscured)",
    isPersistent: true,
    args: { name: "seafile-library-key" },
  },
  {
    name: "--seafile-pass",
    description: "Password (obscured)",
    isPersistent: true,
    args: { name: "seafile-pass" },
  },
  {
    name: "--seafile-url",
    description: "URL of seafile host to connect to",
    isPersistent: true,
    args: { name: "seafile-url" },
  },
  {
    name: "--seafile-user",
    description: "User name (usually email address)",
    isPersistent: true,
    args: { name: "seafile-user" },
  },
  {
    name: "--server-side-across-configs",
    description:
      "Allow server-side operations (e.g. copy) to work across different configs",
    isPersistent: true,
  },
  {
    name: "--sftp-ask-password",
    description: "Allow asking for SFTP password when needed",
    isPersistent: true,
  },
  {
    name: "--sftp-chunk-size",
    description: "Upload and download chunk size",
    isPersistent: true,
    args: { name: "sftp-chunk-size", default: "32Ki" },
  },
  {
    name: "--sftp-concurrency",
    description: "The maximum number of outstanding requests for one file",
    isPersistent: true,
    args: { name: "sftp-concurrency", default: "64" },
  },
  {
    name: "--sftp-disable-concurrent-reads",
    description: "If set don't use concurrent reads",
    isPersistent: true,
  },
  {
    name: "--sftp-disable-concurrent-writes",
    description: "If set don't use concurrent writes",
    isPersistent: true,
  },
  {
    name: "--sftp-disable-hashcheck",
    description:
      "Disable the execution of SSH commands to determine if remote file hashing is available",
    isPersistent: true,
  },
  {
    name: "--sftp-host",
    description: "SSH host to connect to",
    isPersistent: true,
    args: { name: "sftp-host" },
  },
  {
    name: "--sftp-idle-timeout",
    description: "Max time before closing idle connections",
    isPersistent: true,
    args: { name: "sftp-idle-timeout", default: "1m0s" },
  },
  {
    name: "--sftp-key-file",
    description: "Path to PEM-encoded private key file",
    isPersistent: true,
    args: { name: "sftp-key-file" },
  },
  {
    name: "--sftp-key-file-pass",
    description:
      "The passphrase to decrypt the PEM-encoded private key file (obscured)",
    isPersistent: true,
    args: { name: "sftp-key-file-pass" },
  },
  {
    name: "--sftp-key-pem",
    description: "Raw PEM-encoded private key",
    isPersistent: true,
    args: { name: "sftp-key-pem" },
  },
  {
    name: "--sftp-key-use-agent",
    description: "When set forces the usage of the ssh-agent",
    isPersistent: true,
  },
  {
    name: "--sftp-known-hosts-file",
    description: "Optional path to known_hosts file",
    isPersistent: true,
    args: { name: "sftp-known-hosts-file" },
  },
  {
    name: "--sftp-md5sum-command",
    description: "The command used to read md5 hashes",
    isPersistent: true,
    args: { name: "sftp-md5sum-command" },
  },
  {
    name: "--sftp-pass",
    description: "SSH password, leave blank to use ssh-agent (obscured)",
    isPersistent: true,
    args: { name: "sftp-pass" },
  },
  {
    name: "--sftp-path-override",
    description: "Override path used by SSH shell commands",
    isPersistent: true,
    args: { name: "sftp-path-override" },
  },
  {
    name: "--sftp-port",
    description: "SSH port number",
    isPersistent: true,
    args: { name: "sftp-port", default: "22" },
  },
  {
    name: "--sftp-pubkey-file",
    description: "Optional path to public key file",
    isPersistent: true,
    args: { name: "sftp-pubkey-file" },
  },
  {
    name: "--sftp-server-command",
    description:
      "Specifies the path or command to run a sftp server on the remote host",
    isPersistent: true,
    args: { name: "sftp-server-command" },
  },
  {
    name: "--sftp-set-env",
    description: "Environment variables to pass to sftp and commands",
    isPersistent: true,
    args: { name: "sftp-set-env" },
  },
  {
    name: "--sftp-set-modtime",
    description: "Set the modified time on the remote if set",
    isPersistent: true,
  },
  {
    name: "--sftp-sha1sum-command",
    description: "The command used to read sha1 hashes",
    isPersistent: true,
    args: { name: "sftp-sha1sum-command" },
  },
  {
    name: "--sftp-shell-type",
    description: "The type of SSH shell on remote server, if any",
    isPersistent: true,
    args: { name: "sftp-shell-type" },
  },
  {
    name: "--sftp-skip-links",
    description: "Set to skip any symlinks and any other non regular files",
    isPersistent: true,
  },
  {
    name: "--sftp-subsystem",
    description: "Specifies the SSH2 subsystem on the remote host",
    isPersistent: true,
    args: { name: "sftp-subsystem", default: "sftp" },
  },
  {
    name: "--sftp-use-fstat",
    description: "If set use fstat instead of stat",
    isPersistent: true,
  },
  {
    name: "--sftp-use-insecure-cipher",
    description: "Enable the use of insecure ciphers and key exchange methods",
    isPersistent: true,
  },
  {
    name: "--sftp-user",
    description: "SSH username",
    isPersistent: true,
    args: { name: "sftp-user", default: "ryan" },
  },
  {
    name: "--sharefile-chunk-size",
    description: "Upload chunk size",
    isPersistent: true,
    args: { name: "sharefile-chunk-size", default: "64Mi" },
  },
  {
    name: "--sharefile-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "sharefile-encoding",
      default:
        "Slash,LtGt,DoubleQuote,Colon,Question,Asterisk,Pipe,BackSlash,Ctl,LeftSpace,LeftPeriod,RightSpace,RightPeriod,InvalidUtf8,Dot",
    },
  },
  {
    name: "--sharefile-endpoint",
    description: "Endpoint for API calls",
    isPersistent: true,
    args: { name: "sharefile-endpoint" },
  },
  {
    name: "--sharefile-root-folder-id",
    description: "ID of the root folder",
    isPersistent: true,
    args: { name: "sharefile-root-folder-id" },
  },
  {
    name: "--sharefile-upload-cutoff",
    description: "Cutoff for switching to multipart upload",
    isPersistent: true,
    args: { name: "sharefile-upload-cutoff", default: "128Mi" },
  },
  {
    name: "--sia-api-password",
    description: "Sia Daemon API Password (obscured)",
    isPersistent: true,
    args: { name: "sia-api-password" },
  },
  {
    name: "--sia-api-url",
    description: "Sia daemon API URL, like http://sia.daemon.host:9980",
    isPersistent: true,
    args: { name: "sia-api-url", default: "http://127.0.0.1:9980" },
  },
  {
    name: "--sia-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "sia-encoding",
      default: "Slash,Question,Hash,Percent,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--sia-user-agent",
    description: "Siad User Agent",
    isPersistent: true,
    args: { name: "sia-user-agent", default: "Sia-Agent" },
  },
  {
    name: "--size-only",
    description: "Skip based on size only, not mod-time or checksum",
    isPersistent: true,
  },
  {
    name: "--skip-links",
    description: "Don't warn about skipped symlinks",
    isPersistent: true,
  },
  {
    name: "--stats",
    description:
      "Interval between printing stats, e.g. 500ms, 60s, 5m (0 to disable)",
    isPersistent: true,
    args: { name: "stats", default: "1m0s" },
  },
  {
    name: "--stats-file-name-length",
    description: "Max file name length in stats (0 for no limit)",
    isPersistent: true,
    args: { name: "stats-file-name-length", default: "45" },
  },
  {
    name: "--stats-log-level",
    description: "Log level to show --stats output DEBUG|INFO|NOTICE|ERROR",
    isPersistent: true,
    args: { name: "stats-log-level", default: "INFO" },
  },
  {
    name: "--stats-one-line",
    description: "Make the stats fit on one line",
    isPersistent: true,
  },
  {
    name: "--stats-one-line-date",
    description: "Enable --stats-one-line and add current date/time prefix",
    isPersistent: true,
  },
  {
    name: "--stats-one-line-date-format",
    description:
      'Enable --stats-one-line-date and use custom formatted date: Enclose date string in double quotes ("), see https://golang.org/pkg/time/#Time.Format',
    isPersistent: true,
    args: { name: "stats-one-line-date-format" },
  },
  {
    name: "--stats-unit",
    description:
      "Show data rate in stats as either 'bits' or 'bytes' per second",
    isPersistent: true,
    args: { name: "stats-unit", default: "bytes" },
  },
  {
    name: "--storj-access-grant",
    description: "Access grant",
    isPersistent: true,
    args: { name: "storj-access-grant" },
  },
  {
    name: "--storj-api-key",
    description: "API key",
    isPersistent: true,
    args: { name: "storj-api-key" },
  },
  {
    name: "--storj-passphrase",
    description: "Encryption passphrase",
    isPersistent: true,
    args: { name: "storj-passphrase" },
  },
  {
    name: "--storj-provider",
    description: "Choose an authentication method",
    isPersistent: true,
    args: { name: "storj-provider", default: "existing" },
  },
  {
    name: "--storj-satellite-address",
    description: "Satellite address",
    isPersistent: true,
    args: {
      name: "storj-satellite-address",
      default: "us-central-1.storj.io",
    },
  },
  {
    name: "--streaming-upload-cutoff",
    description:
      "Cutoff for switching to chunked upload if file size is unknown, upload starts after reaching cutoff or when file ends",
    isPersistent: true,
    args: { name: "streaming-upload-cutoff", default: "100Ki" },
  },
  {
    name: "--suffix",
    description: "Suffix to add to changed files",
    isPersistent: true,
    args: { name: "suffix" },
  },
  {
    name: "--suffix-keep-extension",
    description: "Preserve the extension when using --suffix",
    isPersistent: true,
  },
  {
    name: "--sugarsync-access-key-id",
    description: "Sugarsync Access Key ID",
    isPersistent: true,
    args: { name: "sugarsync-access-key-id" },
  },
  {
    name: "--sugarsync-app-id",
    description: "Sugarsync App ID",
    isPersistent: true,
    args: { name: "sugarsync-app-id" },
  },
  {
    name: "--sugarsync-authorization",
    description: "Sugarsync authorization",
    isPersistent: true,
    args: { name: "sugarsync-authorization" },
  },
  {
    name: "--sugarsync-authorization-expiry",
    description: "Sugarsync authorization expiry",
    isPersistent: true,
    args: { name: "sugarsync-authorization-expiry" },
  },
  {
    name: "--sugarsync-deleted-id",
    description: "Sugarsync deleted folder id",
    isPersistent: true,
    args: { name: "sugarsync-deleted-id" },
  },
  {
    name: "--sugarsync-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "sugarsync-encoding",
      default: "Slash,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--sugarsync-hard-delete",
    description: "Permanently delete files if true",
    isPersistent: true,
  },
  {
    name: "--sugarsync-private-access-key",
    description: "Sugarsync Private Access Key",
    isPersistent: true,
    args: { name: "sugarsync-private-access-key" },
  },
  {
    name: "--sugarsync-refresh-token",
    description: "Sugarsync refresh token",
    isPersistent: true,
    args: { name: "sugarsync-refresh-token" },
  },
  {
    name: "--sugarsync-root-id",
    description: "Sugarsync root id",
    isPersistent: true,
    args: { name: "sugarsync-root-id" },
  },
  {
    name: "--sugarsync-user",
    description: "Sugarsync user",
    isPersistent: true,
    args: { name: "sugarsync-user" },
  },
  {
    name: "--swift-application-credential-id",
    description: "Application Credential ID (OS_APPLICATION_CREDENTIAL_ID)",
    isPersistent: true,
    args: { name: "swift-application-credential-id" },
  },
  {
    name: "--swift-application-credential-name",
    description: "Application Credential Name (OS_APPLICATION_CREDENTIAL_NAME)",
    isPersistent: true,
    args: { name: "swift-application-credential-name" },
  },
  {
    name: "--swift-application-credential-secret",
    description:
      "Application Credential Secret (OS_APPLICATION_CREDENTIAL_SECRET)",
    isPersistent: true,
    args: { name: "swift-application-credential-secret" },
  },
  {
    name: "--swift-auth",
    description: "Authentication URL for server (OS_AUTH_URL)",
    isPersistent: true,
    args: { name: "swift-auth" },
  },
  {
    name: "--swift-auth-token",
    description:
      "Auth Token from alternate authentication - optional (OS_AUTH_TOKEN)",
    isPersistent: true,
    args: { name: "swift-auth-token" },
  },
  {
    name: "--swift-auth-version",
    description:
      "AuthVersion - optional - set to (1,2,3) if your auth URL has no version (ST_AUTH_VERSION)",
    isPersistent: true,
    args: { name: "swift-auth-version", default: "0" },
  },
  {
    name: "--swift-chunk-size",
    description:
      "Above this size files will be chunked into a _segments container",
    isPersistent: true,
    args: { name: "swift-chunk-size", default: "5Gi" },
  },
  {
    name: "--swift-domain",
    description: "User domain - optional (v3 auth) (OS_USER_DOMAIN_NAME)",
    isPersistent: true,
    args: { name: "swift-domain" },
  },
  {
    name: "--swift-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "swift-encoding", default: "Slash,InvalidUtf8" },
  },
  {
    name: "--swift-endpoint-type",
    description:
      "Endpoint type to choose from the service catalogue (OS_ENDPOINT_TYPE)",
    isPersistent: true,
    args: { name: "swift-endpoint-type", default: "public" },
  },
  {
    name: "--swift-env-auth",
    description:
      "Get swift credentials from environment variables in standard OpenStack form",
    isPersistent: true,
  },
  {
    name: "--swift-key",
    description: "API key or password (OS_PASSWORD)",
    isPersistent: true,
    args: { name: "swift-key" },
  },
  {
    name: "--swift-leave-parts-on-error",
    description: "If true avoid calling abort upload on a failure",
    isPersistent: true,
  },
  {
    name: "--swift-no-chunk",
    description: "Don't chunk files during streaming upload",
    isPersistent: true,
  },
  {
    name: "--swift-region",
    description: "Region name - optional (OS_REGION_NAME)",
    isPersistent: true,
    args: { name: "swift-region" },
  },
  {
    name: "--swift-storage-policy",
    description: "The storage policy to use when creating a new container",
    isPersistent: true,
    args: { name: "swift-storage-policy" },
  },
  {
    name: "--swift-storage-url",
    description: "Storage URL - optional (OS_STORAGE_URL)",
    isPersistent: true,
    args: { name: "swift-storage-url" },
  },
  {
    name: "--swift-tenant",
    description:
      "Tenant name - optional for v1 auth, this or tenant_id required otherwise (OS_TENANT_NAME or OS_PROJECT_NAME)",
    isPersistent: true,
    args: { name: "swift-tenant" },
  },
  {
    name: "--swift-tenant-domain",
    description: "Tenant domain - optional (v3 auth) (OS_PROJECT_DOMAIN_NAME)",
    isPersistent: true,
    args: { name: "swift-tenant-domain" },
  },
  {
    name: "--swift-tenant-id",
    description:
      "Tenant ID - optional for v1 auth, this or tenant required otherwise (OS_TENANT_ID)",
    isPersistent: true,
    args: { name: "swift-tenant-id" },
  },
  {
    name: "--swift-user",
    description: "User name to log in (OS_USERNAME)",
    isPersistent: true,
    args: { name: "swift-user" },
  },
  {
    name: "--swift-user-id",
    description:
      "User ID to log in - optional - most swift systems use user and leave this blank (v3 auth) (OS_USER_ID)",
    isPersistent: true,
    args: { name: "swift-user-id" },
  },
  {
    name: "--syslog",
    description: "Use Syslog for logging",
    isPersistent: true,
  },
  {
    name: "--syslog-facility",
    description: "Facility for syslog, e.g. KERN,USER,",
    isPersistent: true,
    args: { name: "syslog-facility", default: "DAEMON" },
  },
  {
    name: "--tardigrade-access-grant",
    description: "Access grant",
    isPersistent: true,
    hidden: true,
    args: { name: "tardigrade-access-grant" },
  },
  {
    name: "--tardigrade-api-key",
    description: "API key",
    isPersistent: true,
    hidden: true,
    args: { name: "tardigrade-api-key" },
  },
  {
    name: "--tardigrade-passphrase",
    description: "Encryption passphrase",
    isPersistent: true,
    hidden: true,
    args: { name: "tardigrade-passphrase" },
  },
  {
    name: "--tardigrade-provider",
    description: "Choose an authentication method",
    isPersistent: true,
    hidden: true,
    args: { name: "tardigrade-provider", default: "existing" },
  },
  {
    name: "--tardigrade-satellite-address",
    description: "Satellite address",
    isPersistent: true,
    hidden: true,
    args: {
      name: "tardigrade-satellite-address",
      default: "us-central-1.storj.io",
    },
  },
  {
    name: "--temp-dir",
    description: "Directory rclone will use for temporary files",
    isPersistent: true,
    args: {
      name: "temp-dir",
      default: "/var/folders/8d/b_q7td3n4gsbmzq9s1rxq3pm0000gn/T/",
    },
  },
  {
    name: "--timeout",
    description: "IO idle timeout",
    isPersistent: true,
    args: { name: "timeout", default: "5m0s" },
  },
  {
    name: "--tpslimit",
    description: "Limit HTTP transactions per second to this",
    isPersistent: true,
    args: { name: "tpslimit", default: "0" },
  },
  {
    name: "--tpslimit-burst",
    description: "Max burst of transactions for --tpslimit",
    isPersistent: true,
    args: { name: "tpslimit-burst", default: "1" },
  },
  {
    name: "--track-renames",
    description:
      "When synchronizing, track file renames and do a server-side move if possible",
    isPersistent: true,
  },
  {
    name: "--track-renames-strategy",
    description:
      "Strategies to use when synchronizing using track-renames hash|modtime|leaf",
    isPersistent: true,
    args: { name: "track-renames-strategy", default: "hash" },
  },
  {
    name: "--transfers",
    description: "Number of file transfers to run in parallel",
    isPersistent: true,
    args: { name: "transfers", default: "4" },
  },
  {
    name: "--union-action-policy",
    description: "Policy to choose upstream on ACTION category",
    isPersistent: true,
    args: { name: "union-action-policy", default: "epall" },
  },
  {
    name: "--union-cache-time",
    description: "Cache time of usage and free space (in seconds)",
    isPersistent: true,
    args: { name: "union-cache-time", default: "120" },
  },
  {
    name: "--union-create-policy",
    description: "Policy to choose upstream on CREATE category",
    isPersistent: true,
    args: { name: "union-create-policy", default: "epmfs" },
  },
  {
    name: "--union-min-free-space",
    description: "Minimum viable free space for lfs/eplfs policies",
    isPersistent: true,
    args: { name: "union-min-free-space", default: "1Gi" },
  },
  {
    name: "--union-search-policy",
    description: "Policy to choose upstream on SEARCH category",
    isPersistent: true,
    args: { name: "union-search-policy", default: "ff" },
  },
  {
    name: "--union-upstreams",
    description: "List of space separated upstreams",
    isPersistent: true,
    args: { name: "union-upstreams" },
  },
  {
    name: ["--update", "-u"],
    description: "Skip files that are newer on the destination",
    isPersistent: true,
  },
  {
    name: "--uptobox-access-token",
    description: "Your access token",
    isPersistent: true,
    args: { name: "uptobox-access-token" },
  },
  {
    name: "--uptobox-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "uptobox-encoding",
      default:
        "Slash,LtGt,DoubleQuote,BackQuote,Del,Ctl,LeftSpace,InvalidUtf8,Dot",
    },
  },
  {
    name: "--use-cookies",
    description: "Enable session cookiejar",
    isPersistent: true,
  },
  {
    name: "--use-json-log",
    description: "Use json log format",
    isPersistent: true,
  },
  {
    name: "--use-mmap",
    description: "Use mmap allocator (see docs)",
    isPersistent: true,
  },
  {
    name: "--use-server-modtime",
    description: "Use server modified time instead of object metadata",
    isPersistent: true,
  },
  {
    name: "--user-agent",
    description: "Set the user-agent to a specified string",
    isPersistent: true,
    args: { name: "user-agent", default: "rclone/" },
  },
  {
    name: ["--verbose", "-v"],
    description: "Print lots more stuff (repeat for more)",
    isPersistent: true,
    args: { name: "verbose", default: "0" },
  },
  {
    name: "--webdav-bearer-token",
    description: "Bearer token instead of user/pass (e.g. a Macaroon)",
    isPersistent: true,
    args: { name: "webdav-bearer-token" },
  },
  {
    name: "--webdav-bearer-token-command",
    description: "Command to run to get a bearer token",
    isPersistent: true,
    args: { name: "webdav-bearer-token-command" },
  },
  {
    name: "--webdav-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "webdav-encoding" },
  },
  {
    name: "--webdav-headers",
    description: "Set HTTP headers for all transactions",
    isPersistent: true,
    args: { name: "webdav-headers" },
  },
  {
    name: "--webdav-pass",
    description: "Password (obscured)",
    isPersistent: true,
    args: { name: "webdav-pass" },
  },
  {
    name: "--webdav-url",
    description: "URL of http host to connect to",
    isPersistent: true,
    args: { name: "webdav-url" },
  },
  {
    name: "--webdav-user",
    description: "User name",
    isPersistent: true,
    args: { name: "webdav-user" },
  },
  {
    name: "--webdav-vendor",
    description: "Name of the WebDAV site/service/software you are using",
    isPersistent: true,
    args: { name: "webdav-vendor" },
  },
  {
    name: "--yandex-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "yandex-auth-url" },
  },
  {
    name: "--yandex-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "yandex-client-id" },
  },
  {
    name: "--yandex-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "yandex-client-secret" },
  },
  {
    name: "--yandex-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: {
      name: "yandex-encoding",
      default: "Slash,Del,Ctl,InvalidUtf8,Dot",
    },
  },
  {
    name: "--yandex-hard-delete",
    description:
      "Delete files permanently rather than putting them into the trash",
    isPersistent: true,
  },
  {
    name: "--yandex-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "yandex-token" },
  },
  {
    name: "--yandex-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "yandex-token-url" },
  },
  {
    name: "--zoho-auth-url",
    description: "Auth server URL",
    isPersistent: true,
    args: { name: "zoho-auth-url" },
  },
  {
    name: "--zoho-client-id",
    description: "OAuth Client Id",
    isPersistent: true,
    args: { name: "zoho-client-id" },
  },
  {
    name: "--zoho-client-secret",
    description: "OAuth Client Secret",
    isPersistent: true,
    args: { name: "zoho-client-secret" },
  },
  {
    name: "--zoho-encoding",
    description: "The encoding for the backend",
    isPersistent: true,
    args: { name: "zoho-encoding", default: "Del,Ctl,InvalidUtf8" },
  },
  {
    name: "--zoho-region",
    description: "Zoho region to connect to",
    isPersistent: true,
    args: { name: "zoho-region" },
  },
  {
    name: "--zoho-token",
    description: "OAuth Access Token as a JSON blob",
    isPersistent: true,
    args: { name: "zoho-token" },
  },
  {
    name: "--zoho-token-url",
    description: "Token server url",
    isPersistent: true,
    args: { name: "zoho-token-url" },
  },
  { name: ["--help", "-h"], description: "Display help", isPersistent: true },
];

/// Main Spec
const completionSpec: Fig.Spec = {
  name: "rclone",
  description: "The Swiss army knife of cloud storage",
  subcommands: [
    {
      name: "about",
      description: "Get quota information from the remote",
      args: remote,
      options: [
        {
          name: "--full",
          description: "Full numbers instead of SI units",
        },
        {
          name: "--json",
          description: "Format output as JSON",
        },
      ],
    },
    {
      name: "authorize",
      description: "Remote authorization",
      options: [
        {
          name: "--auth-no-open-browser",
          description: "Do not automatically open auth link in default browser",
        },
      ],
    },
    {
      name: "backend",
      description: "Run a backend specific command",
      options: [
        {
          name: "--json",
          description: "Format output as JSON",
        },
        {
          name: ["--option", "-o"],
          description: "Option in the form name=value or name",
          isRepeatable: true,
          args: { name: "option" },
        },
      ],
    },
    {
      name: "bisync",
      description: "Perform bidirectonal synchronization between two paths",

      args: [sourcePath, destPath],
      options: [
        {
          name: "--check-access",
          description:
            "Ensure expected RCLONE_TEST files are found on both Path1 and Path2 filesystems, else abort",
        },
        {
          name: "--check-filename",
          description: "Filename for --check-access (default: RCLONE_TEST)",
          args: { name: "check-filename" },
        },
        {
          name: "--check-sync",
          description:
            "Controls comparison of final listings: true|false|only (default: true)",
          args: { name: "check-sync", default: "true" },
        },
        {
          name: "--filters-file",
          description: "Read filtering patterns from a file",
          args: { name: "filters-file" },
        },
        {
          name: "--force",
          description:
            "Bypass --max-delete safety check and run the sync. Consider using with --verbose",
        },
        {
          name: "--localtime",
          description: "Use local time in listings (default: UTC)",
        },
        {
          name: "--no-cleanup",
          description:
            "Retain working files (useful for troubleshooting and testing)",
        },
        {
          name: "--remove-empty-dirs",
          description: "Remove empty directories at the final cleanup step",
        },
        {
          name: ["--resync", "-1"],
          description:
            "Performs the resync run. Path1 files may overwrite Path2 versions. Consider using --verbose or --dry-run first",
        },
        {
          name: "--workdir",
          description: "Use custom working dir - useful for testing",
          args: { name: "workdir" },
        },
      ],
    },
    {
      name: "cat",
      description: "Concatenates any files and sends them to stdout",
      args: remotePath,
      options: [
        {
          name: "--discard",
          description: "Discard the output instead of printing",
        },
        {
          name: "--count",
          description: "Only print N characters. (default -1)",
          args: {
            name: "N",
            description: "Count",
          },
        },
        {
          name: "--head",
          description: "Only print the first N characters",
          args: {
            name: "N",
            description: "Head",
          },
        },
        {
          name: "--offset",
          description: "Start printing at offset N (or from end if -ve)",
          args: {
            name: "N",
            description: "Offset",
          },
        },
        {
          name: "--tail",
          description: "Only print the last N characters",
          args: {
            name: "N",
            description: "Tail",
          },
        },
      ],
    },
    {
      name: "check",
      description: "Checks the files in the source and destination match",
      args: [sourcePath, remotePath],
      options: [
        {
          name: "--download",
          description: "Check by downloading rather than with hash",
        },
        {
          name: "--combined",
          description: "Make a combined report of changes to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--differ",
          description: "Report all non-matching files to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--error",
          description:
            "Report all files with errors (hashing or reading) to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--match",
          description: "Report all matching files to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--missing-on-dst",
          description:
            "Report all files missing from the destination to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--missing-on-src",
          description: "Report all files missing from the source to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--one-way",
          description: "Check one way only, source files must exist on remote",
        },
      ],
    },
    {
      name: "cleanup",
      description: "Clean up the remote if possible",
      args: remotePath,
    },
    {
      name: "config",
      description: "Enter an interactive configuration session",
      subcommands: [
        {
          name: "create",
          description: "Create a new remote with name, type and options",
          args: [
            {
              name: "name",
              description: "Name of the remote to be created",
            },
            {
              name: "type",
              description: "Type of the new remote to created",
              suggestions: providers,
            },
          ],
          // options: [
          //   {
          //     name: "--all",
          //     description: "Ask the full set of config questions",
          //   },
          //   {
          //     name: "--continue",
          //     description: "Continue the configuration process with an answer",
          //   },
          //   {
          //     name: "--no-obscure",
          //     description: "Force any passwords not to be obscured",
          //   },
          //   {
          //     name: "--non-interactive",
          //     description: "Don't interact with user and return questions",
          //   },
          //   {
          //     name: "--obscure",
          //     description: "Force any passwords to be obscured",
          //   },
          //   {
          //     name: "--result",
          //     description: "Result - use with --continue",
          //     args: { name: "result" },
          //   },
          //   {
          //     name: "--state",
          //     description: "State - use with --continue",
          //     args: { name: "state" },
          //   },
          // ],
        },
        {
          name: "delete",
          description: "Delete an existing remote",
          args: remote,
          isDangerous: true,
        },
        {
          name: "disconnect",
          description: "Disconnects user from remote",
          args: remote,
        },
        { name: "dump", description: "Dump the config file as JSON" },

        {
          name: "file",
          description: "Show path of configuration file in use",
        },
        {
          name: "password",
          description: "Update password in an existing remote",
          args: remote,
        },
        {
          name: "paths",
          description: "Show paths used for configuration, cache, temp etc",
        },
        {
          name: "providers",
          description: "List in JSON format all the providers and options",
        },
        {
          name: "reconnect",
          description: "Re-authenticates user with remote",
          args: remote,
        },
        {
          name: "show",
          description:
            "Print (decrypted) config file, or the config for a single remote",
          args: {
            name: "remote",
            generators: remoteGenerator,
            isOptional: true,
          },
        },
        { name: "touch", description: "Ensure configuration file exists" },
        {
          name: "update",
          description: "Update options in an existing remote",
          args: [
            remote,
            {
              name: "options",
              description:
                "Options passed in pairs of `key value` or as `key=value`",
              isVariadic: true,
            },
          ],
          // options: [
          //   {
          //     name: "--all",
          //     description: "Ask the full set of config questions",
          //   },
          //   {
          //     name: "--continue",
          //     description: "Continue the configuration process with an answer",
          //   },
          //   {
          //     name: "--no-obscure",
          //     description: "Force any passwords not to be obscured",
          //   },
          //   {
          //     name: "--non-interactive",
          //     description: "Don't interact with user and return questions",
          //   },
          //   {
          //     name: "--obscure",
          //     description: "Force any passwords to be obscured",
          //   },
          //   {
          //     name: "--result",
          //     description: "Result - use with --continue",
          //     args: { name: "result" },
          //   },
          //   {
          //     name: "--state",
          //     description: "State - use with --continue",
          //     args: { name: "state" },
          //   },
          // ],
        },
        {
          name: "userinfo",
          description: "Prints info about logged in user of remote",
          options: [{ name: "--json", description: "Format output as JSON" }],
        },
      ],
    },
    {
      name: "copy",
      description: "Copy files from source to dest, skipping already copied",
      args: [sourcePath, destPath],
      options: [
        {
          name: "--create-empty-src-dirs",
          description: "Create empty source dirs on destination after copy",
        },
      ],
    },
    {
      name: "copyto",
      description: "Copy files from source to dest, skipping already copied",
      args: [sourcePath, destPath],
    },
    {
      name: "copyurl",
      description: "Copy url content to dest",
      args: [
        {
          name: "url",
        },
        destPath,
      ],
      options: [
        {
          name: ["--auto-filename", "-a"],
          description:
            "Get the file name from the URL and use it for destination file path",
        },
        {
          name: "--header-filename",
          description: "Get the file name from the Content-Disposition header",
        },
        {
          name: "--no-clobber",
          description: "Prevent overwriting file with same name",
        },
        {
          name: ["--print-filename", "-p"],
          description: "Print the resulting name from --auto-filename",
        },
        {
          name: "--stdout",
          description: "Write the output to stdout rather than a file",
        },
      ],
    },
    {
      name: "cryptcheck",
      description: "Cryptcheck checks the integrity of a crypted remote",
      args: [remotePath, cryptedRemote],
      options: [
        {
          name: "--combined",
          description: "Make a combined report of changes to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--differ",
          description: "Report all non-matching files to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--error",
          description:
            "Report all files with errors (hashing or reading) to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--match",
          description: "Report all matching files to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--missing-on-dst",
          description:
            "Report all files missing from the destination to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--missing-on-src",
          description: "Report all files missing from the source to this file",
          args: { template: "filepaths" },
        },
        {
          name: "--one-way",
          description: "Check one way only, source files must exist on remote",
        },
      ],
    },
    {
      name: "cryptdecode",
      description: "Cryptdecode returns unencrypted file names",
      args: [
        cryptedRemote,
        {
          name: "encryptedfilename",
          isVariadic: true,
        },
      ],
      options: [
        {
          name: "--reverse",
          description: "Reverse cryptdecode, encrypts filenames",
        },
      ],
    },
    {
      name: "dedupe",
      description:
        "Interactively find duplicate filenames and delete/rename them",
      args: remotePath,
      options: [
        {
          name: "--by-hash",
          description: "Find identical hashes rather than names",
        },
        {
          name: "--dedupe-mode",
          description: "Dedupe mode (default: interactive)",
          args: {
            name: "mode",
            suggestions: [
              {
                name: "interactive",
                description: "Interactive",
              },
              {
                name: "skip",
                description: "Removes identical files then skips anything left",
              },
              {
                name: "rename",
                description:
                  "Removes identical files then renames the rest to be different",
              },
              {
                name: "list",
                description:
                  "Lists duplicate dirs and files only and changes nothing",
              },
              {
                name: "first",
                description: "Removes identical files then keeps the first one",
              },
              {
                name: "newest",
                description:
                  "Removes identical files then keeps the newest one",
              },
              {
                name: "oldest",
                description:
                  "Removes identical files then keeps the oldest one",
              },
              {
                name: "largest",
                description:
                  "Removes identical files then keeps the largest one",
              },
              {
                name: "smallest",
                description:
                  "Removes identical files then keeps the smallest one",
              },
            ],
          },
        },
      ],
    },
    {
      name: "delete",
      description: "Remove the files in path",
      isDangerous: true,
      args: remotePath,
      options: [
        {
          name: "--rmdirs",
          description:
            "Rmdirs removes empty directories but leaves root intact",
        },
      ],
    },
    {
      name: "deletefile",
      isDangerous: true,
      description: "Remove a single file from remote",
      args: remotePath,
    },
    {
      name: "genautocomplete",
      description: "Output completion script for a given shell",
      subcommands: [
        {
          name: "bash",
          description: "Output bash completion script for rclone",
          args: {
            name: "output_file",
            isOptional: true,
            description:
              'If output_file is "-", then the output will be written to stdout',
          },
        },
        {
          name: "fish",
          description: "Output fish completion script for rclone",
          args: {
            name: "output_file",
            isOptional: true,
            description:
              'If output_file is "-", then the output will be written to stdout',
          },
        },
        {
          name: "zsh",
          description: "Output zsh completion script for rclone",
          args: {
            name: "output_file",
            isOptional: true,
            description:
              'If output_file is "-", then the output will be written to stdout',
          },
        },
      ],
    },
    {
      name: "gendocs",
      description: "Output markdown docs for rclone to the directory supplied",
      args: {
        name: "output_directory",
        template: "folders",
      },
    },
    {
      name: "hashsum",
      description: "Produces a hashsum file for all the objects in the path",
      args: [
        {
          name: "hash",
          suggestions: hashes,
        },
        remotePath,
      ],
      options: [
        {
          name: "--base64",
          description: "Output base64 encoded hashsum",
        },
        {
          name: "--download",
          description:
            "Download the file and hash it locally; if this flag is not specified, the hash is requested from the remote",
        },
        {
          name: "--output-file",
          description: "Output hashsums to a file rather than the terminal",
          args: {
            template: "filepaths",
          },
        },
      ],
    },
    {
      name: "help",
      description: "Show help for rclone commands, flags and backends",
      subcommands: [
        {
          name: "flags",
          description: "List of global flags",
        },
      ],
    },
    {
      name: "link",
      description: "Generate public link to file/folder",
      args: remotePath,
      options: [
        {
          name: "--expire",
          description:
            "The amount of time that the link will be valid (default off)",
          args: {
            name: "duration",
          },
        },
        {
          name: "--unlink",
          description: "Remove existing public link to file/folder",
        },
      ],
    },
    {
      name: "listremotes",
      description: "List all the remotes in the config file",
      options: [
        {
          name: "--long",
          description: "Show the type as well as names",
        },
      ],
    },
    {
      name: "ls",
      description: "List the objects in the path with size and path",
      args: remotePath,
    },
    {
      name: "lsd",
      description: "List all directories/containers/buckets in the path",
      args: remotePath,
      options: [
        {
          name: ["-R", "--recursive"],
          description: "Recurse into the listing",
        },
      ],
    },
    {
      name: "lsf",
      description:
        "List directories and objects in remote:path formatted for parsing",
      args: {
        ...remotePath,
      },
      options: [
        {
          name: "--dirs-only",
          description: "Only list directories",
        },
        {
          name: "--files-only",
          description: "Only list files",
        },
        {
          name: ["--recursive", "-R"],
          description: "Recurse into the listing",
        },
        {
          name: "--absolute",
          description: "Put a leading / in front of path names",
        },
        {
          name: "--csv",
          description: "Output in CSV format",
        },
        {
          name: ["-d", "--dir-slash"],
          description: "Append a slash to directory names. (default true)",
        },
        {
          name: ["--format", "-F"],
          description: 'Output format - see  help for details (default "p")',
          args: {
            name: "format",
            suggestions: [
              { name: "p", description: "Path" },
              { name: "s", description: "Size" },
              { name: "t", description: "Modification time" },
              { name: "h", description: "Hash" },
              { name: "i", description: "ID of object" },
              { name: "o", description: "Original ID of underlying object" },
              { name: "m", description: "MimeType of object if known" },
            ],
          },
        },
        {
          name: "--hash",
          description:
            'Use this hash when h is used in the format (default "MD5")',
          args: {
            name: "hash",
            suggestions: hashes,
          },
        },
        {
          name: ["--separator", "-s"],
          description: 'Separator for the items in the format. (default ";")',
          args: {
            name: "separator",
          },
        },
      ],
    },
    {
      name: "lsjson",
      description: "List directories and objects in the path in JSON format",
      args: remotePath,
      options: [
        {
          name: "--dirs-only",
          description: "Only list directories",
        },
        {
          name: "--files-only",
          description: "Only list files",
        },
        {
          name: ["--recursive", "-R"],
          description: "Recurse into the listing",
        },
        {
          name: ["--encrypted", "-M"],
          description: "Show the encrypted names",
        },
        {
          name: "--hash",
          description: "Include hashes in the output (may take longer)",
        },
        {
          name: "--hash-type",
          description: "Show only this hash type (may be repeated)",
          isRepeatable: true,
          args: {
            name: "hashes",
            suggestions: hashes,
          },
        },
        {
          name: "--no-mimetype",
          description: "Don't read the mime type (can speed things up)",
        },
        {
          name: "--no-modtime",
          description: "Don't read the modification time (can speed things up)",
        },
        {
          name: "--original",
          description: "Show the ID of the underlying Object",
        },
      ],
    },
    {
      name: "lsl",
      description:
        "List the objects in path with modification time, size and path",
      args: remotePath,
    },
    {
      name: "md5sum",
      description: "Produces an md5sum file for all the objects in the path",
      args: remotePath,
      options: [
        {
          name: "--base64",
          description: "Output base64 encoded hashsum",
        },
        {
          name: "--download",
          description:
            "Download the file and hash it locally; if this flag is not specified, the hash is requested from the remote",
        },
        {
          name: "--output-file",
          description: "Output hashsums to a file rather than the terminal",
          args: {
            name: "file",
            template: "filepaths",
          },
        },
      ],
    },
    {
      name: "mkdir",
      description: "Make the path if it doesn't already exist",
      args: remotePath,
    },
    {
      name: "mount",
      description: "Mount the remote as file system on a mountpoint",
      args: [
        remotePath,
        {
          // TODO: suggest only empty directories
          name: "mountpoint",
          template: "folders",
        },
      ],
    },
    {
      name: "move",
      description: "Move files from source to dest",
      options: [
        {
          name: "--create-empty-src-dirs",
          description: "Create empty source dirs on destination after move",
        },
        {
          name: "--delete-empty-src-dirs",
          description: "Delete empty source dirs after move",
        },
      ],
      args: [sourcePath, destPath],
    },
    {
      name: "moveto",
      description: "Move file or directory from source to dest",
      args: {},
    },
    {
      name: "ncdu",
      description: "Explore a remote with a text based user interface",
      args: {},
    },
    {
      name: "obscure",
      description: "Obscure password for use in the rclone config file",
      args: {},
    },
    {
      name: "purge",
      description: "Remove the path and all of its contents",
      isDangerous: true,
      args: {},
    },
    {
      name: "rc",
      description: "Run a command against a running rclone",
      args: {},
    },
    {
      name: "rcat",
      description: "Copies standard input to file on remote",
      args: {},
    },
    {
      name: "rcd",
      description: "Run rclone listening to remote control commands only",
      args: {},
    },
    {
      name: "rmdir",
      description: "Remove the empty directory at path",
      args: {},
    },
    {
      name: "rmdirs",
      description: "Remove empty directories under the path",
      args: {},
    },
    {
      name: "selfupdate",
      description: "Update the rclone binary",
    },
    {
      name: "serve",
      description: "Serve a remote over a protocol",
      args: [
        {
          name: "protocol",
          suggestions: [
            { name: "dlna", description: "Serve remote:path over DLNA" },
            {
              name: "docker",
              description: "Serve remote:path on docker's volume plugin API",
            },
            { name: "ftp", description: "Serve remote:path over FTP" },
            { name: "http", description: "Serve remote:path over HTTP" },
            {
              name: "restic",
              description: "Serve remote:path for restic's REST API",
            },
            { name: "sftp", description: "Serve remote:path over SFTP" },
            { name: "webdav", description: "Serve remote:path over WebDAV" },
          ],
        },
        remotePath,
      ],
    },
    {
      name: "settier",
      description: "Changes storage class/tier of objects in remote",
      args: [{}, {}],
    },
    {
      name: "sha1sum",
      description: "Produces an sha1sum file for all the objects in the path",
      args: {},
    },
    {
      name: "size",
      description: "Prints the total size and number of objects in remote:path",
      args: {},
    },
    {
      name: "sync",
      description: "Make source and dest identical, modifying destination only",
      args: [sourcePath, destPath],
    },
    {
      name: "test",
      description: "Run a test command",
      args: {},
    },
    {
      name: "touch",
      description: "Create new file or change file modification time",
      args: {},
    },
    {
      name: "tree",
      description: "List the contents of the remote in a tree like fashion",
      args: {},
    },
    {
      name: "version",
      description: "Show the version number",
    },
  ],
};

export default completionSpec;
