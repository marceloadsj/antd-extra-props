// check if child exists and className match
function childIncludesClass(child, matchClass) {
  return (
    child &&
    child.props &&
    child.props.className &&
    child.props.className.includes(matchClass)
  );
}

// inject className on child, making a copy of the object
function injectClassOnChild({ child, parent, propName }) {
  if (parent && parent.props && parent.props[propName]) {
    const newChild = {
      ...child,
      props: { ...child.props },
    };

    newChild.props.className += ` ${parent.props[propName]}`;

    return newChild;
  }

  return child;
}

export default (Card) => {
  // adding bodyClassName and headClassName by monkey patching the component
  const render = Card.prototype.render;

  Card.prototype.render = function () {
    const content = render.bind(this)();

    // the main render returns a render function
    const renderCard = content.props.children;

    const newContent = {
      ...content,

      props: {
        ...content.props,

        children: function () {
          const cardContent = renderCard.bind(this)(...arguments);

          // then the previous render returns another render function
          const renderInline = cardContent.props.children;

          const newCardContent = {
            ...cardContent,

            props: {
              ...cardContent.props,

              children: function () {
                const inlineContent = renderInline.bind(this)(...arguments);

                // and finally we can access the proper card childrens
                const newInlineContent = {
                  ...inlineContent,

                  props: {
                    ...inlineContent.props,
                    children: [...inlineContent.props.children],
                  },
                };

                newInlineContent.props.children.forEach((child, index) => {
                  let newChild = child;

                  if (childIncludesClass(child, "card-body")) {
                    newChild = injectClassOnChild({
                      child,
                      parent: inlineContent,
                      propName: "bodyClassName",
                    });
                  } else if (childIncludesClass(child, "card-head")) {
                    newChild = injectClassOnChild({
                      child,
                      parent: inlineContent,
                      propName: "headClassName",
                    });
                  } else if (childIncludesClass(child, "card-actions")) {
                    newChild = injectClassOnChild({
                      child,
                      parent: inlineContent,
                      propName: "actionsClassName",
                    });
                  }

                  newInlineContent.props.children[index] = newChild;
                });

                // here we clean the props to not have react warning about them
                delete newInlineContent.props.bodyClassName;
                delete newInlineContent.props.headClassName;
                delete newInlineContent.props.coverClassName;
                delete newInlineContent.props.actionsClassName;

                return newInlineContent;
              },
            },
          };

          return newCardContent;
        },
      },
    };

    return newContent;
  };
};
