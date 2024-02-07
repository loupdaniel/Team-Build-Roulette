interface SlotConfigurations {
  /** User configuration for maximum item inside a reel */
  maxReelItems?: number;
  /** User configuration for whether winner should be removed from name list */
  removeWinner?: boolean;
  /** User configuration for element selector which reel items should append to */
  reelContainerSelector: string;

  reelGenreContainerSelector: string;

  reelStyleContainerSelector: string;

  reelBassContainerSelector: string;

  reelDrumContainerSelector: string;
  /** User configuration for callback function that runs before spinning reel */
  onSpinStart?: () => void;
  /** User configuration for callback function that runs after spinning reel */
  onSpinEnd?: () => void;

  /** User configuration for callback function that runs after user updates the name list */
  onNameListChanged?: () => void;
}

/** Class for doing random name pick and animation */
export default class Slot {
  /** List of names to draw from */
  private nameList: string[];

  private genreList: string[];

  private styleList: string[];

  private bassList: string[];

  private drumList: string[];

  /** Whether there is a previous winner element displayed in reel */
  private havePreviousWinner: boolean;

  /** Container that hold the reel items */
  private reelContainer: HTMLElement | null;

  private reelGenreContainer: HTMLElement | null;

  private reelStyleContainer: HTMLElement | null;

  private reelBassContainer: HTMLElement | null;

  private reelDrumContainer: HTMLElement | null;

  /** Maximum item inside a reel */
  private maxReelItems: NonNullable<SlotConfigurations['maxReelItems']>;

  /** Whether winner should be removed from name list */
  private shouldRemoveWinner: NonNullable<SlotConfigurations['removeWinner']>;

  /** Reel animation object instance */
  private reelAnimation?: Animation;

  private reelGenreAnimation?: Animation;

  private reelStyleAnimation?: Animation;

  private reelBassAnimation?: Animation;

  private reelDrumAnimation?: Animation;

  private createReelAnimation(container: HTMLElement | null): Animation | undefined {
    return container?.animate(
      [
        { transform: 'none', filter: 'blur(0)' },
        { filter: 'blur(1px)', offset: 0.5 },
        // Here we transform the reel to move up and stop at the top of last item
        // "(Number of item - 1) * height of reel item" of wheel is the amount of pixel to move up
        // 7.5rem * 16 = 120px, which equals to reel item height
        { transform: `translateY(-${(this.maxReelItems - 1) * (7.5 * 16)}px)`, filter: 'blur(0)' }
      ],
      {
        duration: this.maxReelItems * 100, // 100ms for 1 item
        easing: 'ease-in-out',
        iterations: 1
      }
    );
  }

  /** Callback function that runs before spinning reel */
  private onSpinStart?: NonNullable<SlotConfigurations['onSpinStart']>;

  /** Callback function that runs after spinning reel */
  private onSpinEnd?: NonNullable<SlotConfigurations['onSpinEnd']>;

  /** Callback function that runs after spinning reel */
  private onNameListChanged?: NonNullable<SlotConfigurations['onNameListChanged']>;

  /**
   * Constructor of Slot
   * @param maxReelItems  Maximum item inside a reel
   * @param removeWinner  Whether winner should be removed from name list
   * @param reelContainerSelector  The element ID of reel items to be appended
   * @param reelGenreContainerSelector
   * @param reelStyleContainerSelector
   * @param reelBassContainerSelector
   * @param reelDrumContainerSelector
   * @param onSpinStart  Callback function that runs before spinning reel
   * @param onNameListChanged  Callback function that runs when user updates the name list
   */
  constructor(
    {
      maxReelItems = 30,
      removeWinner = true,
      reelContainerSelector,
      reelGenreContainerSelector,
      reelStyleContainerSelector,
      reelBassContainerSelector,
      reelDrumContainerSelector,
      onSpinStart,
      onSpinEnd,
      onNameListChanged
    }: SlotConfigurations
  ) {
    this.nameList = [];
    this.genreList = [];
    this.styleList = [];
    this.bassList = [];
    this.drumList = [];
    this.havePreviousWinner = false;
    this.reelContainer = document.querySelector(reelContainerSelector);
    this.reelGenreContainer = document.querySelector(reelGenreContainerSelector);
    this.reelStyleContainer = document.querySelector(reelStyleContainerSelector);
    this.reelBassContainer = document.querySelector(reelBassContainerSelector);
    this.reelDrumContainer = document.querySelector(reelDrumContainerSelector);
    this.maxReelItems = maxReelItems;
    this.shouldRemoveWinner = removeWinner;
    this.onSpinStart = onSpinStart;
    this.onSpinEnd = onSpinEnd;
    this.onNameListChanged = onNameListChanged;

    // Separate animations for name, genre, and style
    this.reelAnimation = this.createReelAnimation(this.reelContainer);
    this.reelGenreAnimation = this.createReelAnimation(this.reelGenreContainer);
    this.reelStyleAnimation = this.createReelAnimation(this.reelStyleContainer);
    this.reelBassAnimation = this.createReelAnimation(this.reelBassContainer);
    this.reelDrumAnimation = this.createReelAnimation(this.reelDrumContainer);
  }

  /**
   * Setter for name list
   * @param names  List of names to draw a winner from
   */
  set names(names: string[]) {
    this.nameList = names;

    const reelItemsToRemove = this.reelContainer?.children
      ? Array.from(this.reelContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get names(): string[] {
    return this.nameList;
  }

  /**
   * Setter for name list
   * @param genres  List of names to draw a winner from
   */
  set genres(genres: string[]) {
    this.genreList = genres;

    const reelItemsToRemove = this.reelGenreContainer?.children
      ? Array.from(this.reelGenreContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get genres(): string[] {
    return this.genreList;
  }

  /**
   * Setter for name list
   * @param styles  List of names to draw a winner from
   */
  set styles(styles: string[]) {
    this.styleList = styles;

    const reelItemsToRemove = this.reelStyleContainer?.children
      ? Array.from(this.reelStyleContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get styles(): string[] {
    return this.styleList;
  }

  /**
   * Setter for name list
   * @param basses  List of names to draw a winner from
   */
  set basses(basses: string[]) {
    this.bassList = basses;

    const reelItemsToRemove = this.reelBassContainer?.children
      ? Array.from(this.reelBassContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get basses(): string[] {
    return this.bassList;
  }

  /**
   * Setter for name list
   * @param drums  List of names to draw a winner from
   */
  set drums(drums: string[]) {
    this.drumList = drums;

    const reelItemsToRemove = this.reelDrumContainer?.children
      ? Array.from(this.reelDrumContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get drums(): string[] {
    return this.drumList;
  }

  /**
   * Setter for shouldRemoveWinner
   * @param removeWinner  Whether the winner should be removed from name list
   */
  set shouldRemoveWinnerFromNameList(removeWinner: boolean) {
    this.shouldRemoveWinner = removeWinner;
  }

  /** Getter for shouldRemoveWinner */
  get shouldRemoveWinnerFromNameList(): boolean {
    return this.shouldRemoveWinner;
  }

  /**
   * Returns a new array where the items are shuffled
   * @template T  Type of items inside the array to be shuffled
   * @param array  The array to be shuffled
   * @returns The shuffled array
   */
  private static shuffleNames<T = unknown>(array: T[]): T[] {
    const keys = Object.keys(array) as unknown[] as number[];
    const result: T[] = [];
    for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
      // eslint-disable-next-line no-bitwise
      const i = Math.random() * n | 0;
      const key = keys[i];
      result.push(array[key]);
      n -= 1;
      const tmp = keys[n];
      keys[n] = key;
      keys[i] = tmp;
    }
    return result;
  }

  /**
   * Function for spinning the slot
   * @returns Whether the spin is completed successfully
   */
  public async spin(): Promise<boolean> {
    if (!this.nameList.length) {
      console.error('Name List is empty. Cannot start spinning.');
      return false;
    }

    if (this.onSpinStart) {
      this.onSpinStart();
    }

    const {
      reelContainer,
      reelGenreContainer,
      reelStyleContainer,
      reelBassContainer,
      reelDrumContainer,
      reelAnimation,
      reelGenreAnimation,
      reelStyleAnimation,
      reelBassAnimation,
      reelDrumAnimation,
      shouldRemoveWinner
    } = this;
    if ((!reelContainer || !reelAnimation)
      && (!reelGenreContainer || !reelGenreAnimation)
      && (!reelStyleContainer || !reelStyleAnimation)
      && (!reelBassContainer || !reelBassAnimation)
      && (!reelDrumContainer || !reelDrumAnimation)) {
      return false;
    }

    // Shuffle names and create reel items
    let randomNames = Slot.shuffleNames<string>(this.nameList);

    while (randomNames.length && randomNames.length < this.maxReelItems) {
      randomNames = [...randomNames, ...randomNames];
    }

    randomNames = randomNames.slice(0, this.maxReelItems - Number(this.havePreviousWinner));

    // Shuffle names and create reel items
    let randomGenres = Slot.shuffleNames<string>(this.genreList);

    while (randomGenres.length && randomGenres.length < this.maxReelItems) {
      randomGenres = [...randomGenres, ...randomGenres];
    }

    randomGenres = randomGenres.slice(0, this.maxReelItems - Number(this.havePreviousWinner));

    // Shuffle names and create reel items
    let randomStyles = Slot.shuffleNames<string>(this.styleList);

    while (randomStyles.length && randomStyles.length < this.maxReelItems) {
      randomStyles = [...randomStyles, ...randomStyles];
    }

    randomStyles = randomStyles.slice(0, this.maxReelItems - Number(this.havePreviousWinner));

    let randomBasses = Slot.shuffleNames<string>(this.bassList);

    while (randomBasses.length && randomBasses.length < this.maxReelItems) {
      randomBasses = [...randomBasses, ...randomBasses];
    }

    randomBasses = randomBasses.slice(0, this.maxReelItems - Number(this.havePreviousWinner));

    let randomDrums = Slot.shuffleNames<string>(this.drumList);

    while (randomDrums.length && randomDrums.length < this.maxReelItems) {
      randomDrums = [...randomDrums, ...randomDrums];
    }

    randomDrums = randomDrums.slice(0, this.maxReelItems - Number(this.havePreviousWinner));

    const nameFragment = document.createDocumentFragment();
    randomNames.forEach((name) => {
      const newReelItem = document.createElement('div');
      newReelItem.innerHTML = name;
      nameFragment.appendChild(newReelItem);
    });
    reelContainer!.appendChild(nameFragment);

    const genreFragment = document.createDocumentFragment();
    randomGenres.forEach((genre) => {
      const newGenreReelItem = document.createElement('div');
      newGenreReelItem.innerHTML = genre;
      genreFragment.appendChild(newGenreReelItem);
    });
    reelGenreContainer!.appendChild(genreFragment);

    const styleFragment = document.createDocumentFragment();
    randomStyles.forEach((style) => {
      const newStyleReelItem = document.createElement('div');
      newStyleReelItem.innerHTML = style;
      styleFragment.appendChild(newStyleReelItem);
    });
    reelStyleContainer!.appendChild(styleFragment);

    const bassFragment = document.createDocumentFragment();
    randomBasses.forEach((style) => {
      const newBassReelItem = document.createElement('div');
      newBassReelItem.innerHTML = style;
      bassFragment.appendChild(newBassReelItem);
    });
    reelBassContainer!.appendChild(bassFragment);

    const drumFragment = document.createDocumentFragment();
    randomDrums.forEach((style) => {
      const newDrumReelItem = document.createElement('div');
      newDrumReelItem.innerHTML = style;
      drumFragment.appendChild(newDrumReelItem);
    });
    reelDrumContainer!.appendChild(drumFragment);

    console.log('Displayed items: ', randomNames);
    console.log('Winner: ', randomNames[randomNames.length - 1]);

    // Remove winner form name list if necessary
    if (shouldRemoveWinner) {
      this.nameList.splice(this.nameList.findIndex(
        (name) => name === randomNames[randomNames.length - 1]
      ), 1);

      this.genreList.splice(this.genreList.findIndex(
        (genre) => genre === randomGenres[randomGenres.length - 1]
      ), 1);

      this.styleList.splice(this.styleList.findIndex(
        (style) => style === randomStyles[randomStyles.length - 1]
      ), 1);

      this.bassList.splice(this.bassList.findIndex(
        (bass) => bass === randomBasses[randomBasses.length - 1]
      ), 1);

      this.drumList.splice(this.drumList.findIndex(
        (drum) => drum === randomDrums[randomDrums.length - 1]
      ), 1);
    }

    console.log('Remaining: ', this.nameList);

    // Play the spin animation
    const animationPromise = new Promise<void>((resolve) => {
      const onAnimationFinish = () => {
        reelAnimation?.removeEventListener('finish', onAnimationFinish);
        reelGenreAnimation?.removeEventListener('finish', onAnimationFinish);
        reelStyleAnimation?.removeEventListener('finish', onAnimationFinish);
        reelBassAnimation?.removeEventListener('finish', onAnimationFinish);
        reelDrumAnimation?.removeEventListener('finish', onAnimationFinish);
        resolve();
      };

      reelAnimation?.addEventListener('finish', onAnimationFinish);
      reelGenreAnimation?.addEventListener('finish', onAnimationFinish);
      reelStyleAnimation?.addEventListener('finish', onAnimationFinish);
      reelBassAnimation?.addEventListener('finish', onAnimationFinish);
      reelDrumAnimation?.addEventListener('finish', onAnimationFinish);

      reelAnimation?.play();
      reelGenreAnimation?.play();
      reelStyleAnimation?.play();
      reelBassAnimation?.play();
      reelDrumAnimation?.play();
    });

    await animationPromise;

    // Sets the current playback time to the end of the animation
    // Fix issue for animation not playing after the initial play on Safari
    reelAnimation?.finish();
    reelGenreAnimation?.finish();
    reelStyleAnimation?.finish();
    reelBassAnimation?.finish();
    reelDrumAnimation?.finish();

    Array.from(reelContainer!.children)
      .slice(0, reelContainer!.children.length - 1)
      .forEach((element) => element.remove());

    Array.from(reelGenreContainer!.children)
      .slice(0, reelGenreContainer!.children.length - 1)
      .forEach((element) => element.remove());

    Array.from(reelStyleContainer!.children)
      .slice(0, reelStyleContainer!.children.length - 1)
      .forEach((element) => element.remove());
    
    Array.from(reelBassContainer!.children)
      .slice(0, reelBassContainer!.children.length - 1)
        .forEach((element) => element.remove());
    
    Array.from(reelDrumContainer!.children)
      .slice(0, reelDrumContainer!.children.length - 1)
      .forEach((element) => element.remove());

    this.havePreviousWinner = true;

    if (this.onSpinEnd) {
      this.onSpinEnd();
    }
    return true;
  }
}
