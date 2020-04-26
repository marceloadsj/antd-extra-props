## Antd-extra-props

A small lib to inject common props to Ant Design component library. It uses monkey patch to add some extra props helping expand the use of the ui library.

### Install

```
yarn add antd-extra-props
```

or

```
npm install antd-extra-props
```

### Use

```javascript
// your entry file, like index.js
import { Card } from "antd";
import antdExtraProps from "antd-extra-props";

antdExtraProps({ Card });
```

And later:

```jsx
function MyComponent() {
  return (
    <Card
      title="Card head"
      headClassName="text-purple-500"
      bodyClassName="px-10 py-20"
    >
      Card body
    </Card>
  );
}
```

### Available Props

| component | prop          | type   | default value |
| --------- | ------------- | ------ | ------------- |
| Card      | headClassName | string | undefined     |
| Card      | bodyClassName | string | undefined     |
