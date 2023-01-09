# Source forms from the Hubspot CRM

This reads hubspot form definitions from the hubspot CRM and renders them in the UI

## Installation

```shell
yarn add @bond-london/gatsby-source-hubspot-forms
```

## Configuration

Inside the gatsby configuration file add a plugin entry as follow

```js
{
    resolve: "@bond-london/gatsby-source-hubspot-forms",
    options: {
        hubspotApiKey: process.env.HUBSPOT_API_KEY,
    },
},
```
