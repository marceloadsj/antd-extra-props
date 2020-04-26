export default (Card) => {
  // adding bodyClassName and headClassName by monkey patching the component
  const cardRender = Card.prototype.render;

  Card.prototype.render = function () {
    const content = cardRender.bind(this)();

    const renderCard = content.props.children;

    const newContent = {
      ...content,

      props: {
        ...content.props,

        children: function () {
          const cardContent = renderCard.bind(this)(...arguments);

          const renderInline = cardContent.props.children;

          const newCardContent = {
            ...cardContent,

            props: {
              ...cardContent.props,

              children: function () {
                const inlineContent = renderInline.bind(this)(...arguments);

                const newInlineContent = {
                  ...inlineContent,

                  props: {
                    ...inlineContent.props,
                    children: [...inlineContent.props.children],
                  },
                };

                delete newInlineContent.props.bodyClassName;

                newInlineContent.props.children.forEach((child, index) => {
                  if (child?.props?.className.includes("card-body")) {
                    const newChild = {
                      ...child,
                      props: { ...child.props },
                    };

                    newChild.props.className += ` ${inlineContent.props.bodyClassName}`;

                    newInlineContent.props.children[index] = newChild;
                  }
                });

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
