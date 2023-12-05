import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

import Theme from './Theme'

addons.setConfig({
  theme: Theme,
});