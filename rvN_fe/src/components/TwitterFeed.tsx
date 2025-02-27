import React from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

const TwitterFeed: React.FC = () => {
  return (
    <div className="flex space-x-4">
      {/* Recent tweets related to #wildlife */}
      <div className="w-1/2 mb-4 hover:transform hover:scale-105 transition-transform">
        <TwitterTimelineEmbed
          sourceType="profile"
          screenName="MTPHereToHelp"
          options={{ height: 600 }}
          noScrollbar
          noHeader
          noFooter
        />
      </div>
    </div>
  );
};

export default TwitterFeed;
