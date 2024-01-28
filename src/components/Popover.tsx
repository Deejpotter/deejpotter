'use client';
import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  Placement,
  FloatingPortal,
  FloatingFocusManager,
  useId
} from "@floating-ui/react";

/**
 * PopoverOptions are the options that can be passed to `usePopover`.
 * `initialOpen` is the initial state of the popover, it can be true or false.
 * `placement` is the placement of the popover relative to the anchor, it can be one of the following: `top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`, `right`, `right-start`, `right-end`.
 * `modal` is a boolean that determines whether the popover should be modal or not, if it is modal, the popover will trap focus within itself.
 * `open` is the controlled state of the popover, it can be true or false.
 * `onOpenChange` is a callback that is called when the popover is opened or closed, it is called with a boolean that indicates whether the popover is open or not. The default value is `undefined` which means nothing will happen when the popover is opened or closed.
 */
interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * `usePopover` is a custom hook that manages the state and interactions of the popover.
 * It accepts an options object of type `PopoverOptions`.
 * It returns an object with the following properties:
 * - `open`: a boolean indicating whether the popover is open or not.
 * - `setOpen`: a function to set the `open` state.
 * - `interactions`: an object containing the interactions of the popover.
 * - `data`: an object containing the data of the popover.
 * - `modal`: a boolean indicating whether the popover is modal or not.
 * - `labelId`: a string representing the id of the label of the popover.
 * - `descriptionId`: a string representing the id of the description of the popover.
 * - `setLabelId`: a function to set the `labelId`.
 * - `setDescriptionId`: a function to set the `descriptionId`.
 */
export function usePopover({
  initialOpen = false,
  placement = "bottom",
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const [labelId, setLabelId] = React.useState<string | undefined>();
  const [descriptionId, setDescriptionId] = React.useState<
    string | undefined
  >();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 5
      }),
      shift({ padding: 5 })
    ]
  });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId
    }),
    [open, setOpen, interactions, data, modal, labelId, descriptionId]
  );
}

type ContextType =
  | (ReturnType<typeof usePopover> & {
      setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>;
      setDescriptionId: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
    })
  | null;

const PopoverContext = React.createContext<ContextType>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);

  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }

  return context;
};

/**
 * `Popover` is a component that wraps the popover components.
 * It accepts the following props:
 * - `children`: the elements to be rendered inside the popover.
 * - `modal`: a boolean indicating whether the popover is modal or not.
 * - `...restOptions`: other options that can be passed to `usePopover`.
 * It renders the children wrapped in a `PopoverContext.Provider`.
 */
export function Popover({
  children,
  modal = false,
  ...restOptions
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

/**
 * `PopoverTrigger` is a component that triggers the popover.
 * It accepts the following props:
 * - `children`: the elements to be rendered inside the trigger.
 * - `asChild`: a boolean indicating whether any element can be passed as the anchor.
 * It renders a button or the child element passed to it.
 */
export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & PopoverTriggerProps
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? "open" : "closed"
      })
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      // The user can style the trigger based on the state
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

/**
 * `PopoverContent` is a component that renders the content of the popover.
 * It accepts all the properties of `React.HTMLProps<HTMLDivElement>`.
 * It renders a `div` with the popover content.
 */
export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function PopoverContent({ style, ...props }, propRef) {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          {props.children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

/**
 * `PopoverHeading` is a component that renders the heading of the popover.
 * It accepts all the properties of `React.HTMLProps<HTMLHeadingElement>`.
 * It renders a `h2` element with the popover heading.
 */
export const PopoverHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLProps<HTMLHeadingElement>
>(function PopoverHeading(props, ref) {
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...props} ref={ref} id={id}>
      {props.children}
    </h2>
  );
});

/**
 * `PopoverDescription` is a component that renders the description of the popover.
 * It accepts all the properties of `React.HTMLProps<HTMLParagraphElement>`.
 * It renders a `p` element with the popover description.
 */
export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLProps<HTMLParagraphElement>
>(function PopoverDescription(props, ref) {
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  React.useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p {...props} ref={ref} id={id} />;
});

/**
 * `PopoverClose` is a component that renders a close button for the popover.
 * It accepts all the properties of `React.ButtonHTMLAttributes<HTMLButtonElement>`.
 * It renders a `button` element that closes the popover when clicked.
 */
export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      type="button"
      ref={ref}
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        setOpen(false);
      }}
    />
  );
});

