import express from 'express';
import * as classyTheme from '@jsonresume/jsonresume-theme-class';
import * as eloquentTheme from 'jsonresume-theme-eloquent-ru';
import * as compactTheme from '@warleon/jsonresume-theme-compact';
import * as paperTheme from 'jsonresume-theme-paper';
import * as rocketTheme from 'jsonresume-theme-rocketspacer';

const router = express.Router();

const getRenderFn = (themeModule) => {
  return themeModule?.render || themeModule?.default?.render || themeModule?.default || themeModule;
};

const themes = {
  classy: getRenderFn(classyTheme),
  eloquent: getRenderFn(eloquentTheme),
  compact: getRenderFn(compactTheme),
  paper: getRenderFn(paperTheme),
  rocket: getRenderFn(rocketTheme),
};

router.post('/render', async (req, res) => {
  try {
    const { templateId, jsonResume } = req.body;
    
    const renderFn = themes[templateId];
    if (!renderFn || typeof renderFn !== 'function') {
      return res.status(404).json({ error: `Template ${templateId} not found or not renderable` });
    }

    const html = renderFn(jsonResume);
    res.send(html);
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: 'Failed to render resume' });
  }
});

export default router;
