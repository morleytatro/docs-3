const config = require('./contrib/config.js')
const fs = require('fs')

const githubRepoName =
  config.projectSlug === 'ecosystem' ? 'docs' : config.projectSlug

let links = [
  {
    to: 'https://www.ory.sh/',
    label: `Home`,
    position: 'left'
  },
  {
    href: `https://github.com/ory/${githubRepoName}/discussions`,
    label: 'Discussions',
    position: 'right'
  },
  {
    href: 'https://www.ory.sh/chat',
    label: 'Slack',
    position: 'right'
  },
  {
    href: `https://github.com/ory/${githubRepoName}`,
    label: 'GitHub',
    position: 'right'
  }
]

const customCss = [require.resolve('./contrib/theme.css')]

if (fs.existsSync('./src/css/theme.css')) {
  customCss.push(require.resolve('./src/css/theme.css'))
}

const githubPrismTheme = require('prism-react-renderer/themes/github')

const prismThemeLight = {
  ...githubPrismTheme,
  styles: [
    ...githubPrismTheme.styles,
    {
      languages: ['keto-relation-tuples'],
      types: ['namespace'],
      style: {
        color: '#666'
      }
    },
    {
      languages: ['keto-relation-tuples'],
      types: ['object'],
      style: {
        color: '#939'
      }
    },
    {
      languages: ['keto-relation-tuples'],
      types: ['relation'],
      style: {
        color: '#e80'
      }
    },
    {
      languages: ['keto-relation-tuples'],
      types: ['delimiter'],
      style: {
        color: '#555'
      }
    },
    {
      languages: ['keto-relation-tuples'],
      types: ['comment'],
      style: {
        color: '#999'
      }
    },
    {
      languages: ['keto-relation-tuples'],
      types: ['subject'],
      style: {
        color: '#903'
      }
    }
  ]
}

const oathkeeper = 'oathkeeper'
const cloud = 'cloud'

const projectNavs = {
  [cloud]: undefined,
  [oathkeeper]: undefined
}

function setProjectNav(result, project) {
  projectNavs[project] = JSON.stringify(result)
}

function getProjectNav(project) {
  const inner = (resolve) => {
    console.log(project, projectNavs[project])
    if (projectNavs[project]) {
      return resolve(JSON.parse(projectNavs[project]))
    }

    setTimeout(() => {
      inner(resolve)
    }, 10)
  }

  return new Promise((resolve) => {
    inner(resolve)
  })
}

module.exports = {
  title: config.projectName,
  tagline: config.projectTagLine,
  url: `https://www.ory.sh/`,
  baseUrl: '/',
  favicon: 'img/favico.png',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'ory', // Usually your GitHub org/user name.
  projectName: config.projectSlug, // Usually your repo name.
  themeConfig: {
    prism: {
      theme: prismThemeLight,
      darkTheme: require('prism-react-renderer/themes/dracula'),
      additionalLanguages: ['pug', 'shell-session']
    },
    announcementBar: {
      id: 'supportus',
      content: `Sign up for <a href="${config.newsletter}">important security announcements</a> and if you like the ${config.projectName} give us some ⭐️ on <a target="_blank" rel="noopener noreferrer" href="https://github.com/ory">GitHub</a>!`
    },
    algolia: {
      apiKey: '8463c6ece843b377565726bb4ed325b0',
      indexName: 'ory',
      contextualSearch: true,
      searchParameters: {
        facetFilters: [[`tags:docs`]]
      }
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: config.projectName,
        src: `img/logo-docs.svg`,
        srcDark: `img/logo-docs.svg`,
        href: `https://www.ory.sh`
      },
      items: [
        ...links,
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: 'All versions'
            }
          ]
        }
      ]
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} ORY GmbH`,
      links: [
        {
          title: 'Company',
          items: [
            {
              label: 'Imprint',
              href: 'https://www.ory.sh/imprint'
            },
            {
              label: 'Privacy',
              href: 'https://www.ory.sh/privacy'
            },
            {
              label: 'Terms',
              href: 'https://www.ory.sh/tos'
            }
          ]
        }
      ]
    }
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'docs/cloud',
        sidebarItemsGenerator: async function ({
                                                 defaultSidebarItemsGenerator,
                                                 ...args
                                               }) {
          const sidebarItems = await defaultSidebarItemsGenerator(args);
          setProjectNav(sidebarItems, cloud)
          return [
            { type: 'doc', id: 'early-access' },
            { type: 'doc', id: 'sdk' },
            // ...sidebarItems,
            // ...await getProjectNav(oathkeeper),
            // ...await defaultSidebarItemsGenerator(getProjectNav(args, 'oathkeeper')),
          ];
        },
        routeBasePath: '/docs',
        // sidebarPath: require.resolve('./sidebar.cloud.js'),
        // editUrl: `https://github.com/ory/docs/edit/master/docs`,
        // editCurrentVersion: false,
        // showLastUpdateAuthor: true,
        // showLastUpdateTime: true,
        // disableVersioning: false,
        // include: ['**/*.md', '**/*.mdx', '**/*.jsx'],
        // docLayoutComponent: '@theme/RoutedDocPage'
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'oathkeeper',
        path: 'docs/oathkeeper',
        sidebarItemsGenerator: async function ({
                                                 defaultSidebarItemsGenerator,
                                                 ...args
                                               }) {
          console.log(args)
          const sidebarItems = await defaultSidebarItemsGenerator(args);
          setProjectNav(sidebarItems, oathkeeper)
          // const c = await getProjectNav(cloud)
          // console.log(c, sidebarItems)
          return [
            { type: 'doc', id: 'sdk' },
            ...sidebarItems
          ]
        },
        routeBasePath: '/oathkeeper/docs',
        // editUrl: `https://github.com/ory/docs/edit/master/docs`,
        // editCurrentVersion: false,
        // showLastUpdateAuthor: true,
        // showLastUpdateTime: true,
        // disableVersioning: false,
        // include: ['**/*.md', '**/*.mdx', '**/*.jsx'],
        // docLayoutComponent: '@theme/RoutedDocPage'
      }
    ],
    '@docusaurus/plugin-content-pages',
    require.resolve('./src/plugins/docusaurus-plugin-matamo'),
    '@docusaurus/plugin-sitemap'
  ],
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss
      }
    ],
    '@docusaurus/theme-search-algolia',
    'docusaurus-theme-redoc'
  ]
}
