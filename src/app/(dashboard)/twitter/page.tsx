"use client"
import React, {useState} from 'react';
import { Heart, MessageCircle, Repeat2, Share, Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, Image, Smile, Calendar, MapPin } from 'lucide-react';

const TwitterClone = () => {
  const [tweets, setTweets] = useState([
    {
      id: 1,
      user: { name: 'Alex Chen', username: 'alexchen', avatar: 'AC' },
      content: 'Just launched my new project! Excited to share it with the world. The journey has been incredible and I can\'t wait to see what comes next. 🚀',
      timestamp: '2h',
      likes: 24,
      retweets: 5,
      replies: 8,
      liked: false,
      retweeted: false
    },
    {
      id: 2,
      user: { name: 'Sarah Williams', username: 'sarahw', avatar: 'SW' },
      content: 'Beautiful sunset today! Sometimes you need to pause and appreciate the simple moments in life. Nature never fails to inspire me. 🌅',
      timestamp: '4h',
      likes: 42,
      retweets: 12,
      replies: 15,
      liked: true,
      retweeted: false
    },
    {
      id: 3,
      user: { name: 'Dev Community', username: 'devcommunity', avatar: 'DC' },
      content: 'New React 19 features are game-changing! The concurrent rendering improvements are incredible. Who else is excited about the performance boosts?',
      timestamp: '6h',
      likes: 156,
      retweets: 43,
      replies: 28,
      liked: false,
      retweeted: true
    }
  ]);

  const [newTweet, setNewTweet] = useState('');

  const handleTweet = () => {
    if (newTweet.trim()) {
      const tweet = {
        id: Date.now(),
        user: { name: 'You', username: 'yourhandle', avatar: 'YU' },
        content: newTweet,
        timestamp: 'now',
        likes: 0,
        retweets: 0,
        replies: 0,
        liked: false,
        retweeted: false
      };
      setTweets([tweet, ...tweets]);
      setNewTweet('');
    }
  };

  const toggleLike = (id) => {
    setTweets(tweets.map(tweet => 
      tweet.id === id 
        ? { ...tweet, liked: !tweet.liked, likes: tweet.liked ? tweet.likes - 1 : tweet.likes + 1 }
        : tweet
    ));
  };

  const toggleRetweet = (id) => {
    setTweets(tweets.map(tweet => 
      tweet.id === id 
        ? { ...tweet, retweeted: !tweet.retweeted, retweets: tweet.retweeted ? tweet.retweets - 1 : tweet.retweets + 1 }
        : tweet
    ));
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Explore', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Mail, label: 'Messages', active: false },
    { icon: Bookmark, label: 'Bookmarks', active: false },
    { icon: User, label: 'Profile', active: false },
    { icon: MoreHorizontal, label: 'More', active: false }
  ];

  const TweetCard = ({ tweet }) => (
    <div className="border-b border-gray-800 p-4 hover:bg-gray-950 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {tweet.user.avatar}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-white hover:underline">{tweet.user.name}</h3>
            <span className="text-gray-500">@{tweet.user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{tweet.timestamp}</span>
          </div>
          
          <p className="text-white mt-1 leading-relaxed">{tweet.content}</p>
          
          <div className="flex items-center justify-between mt-3 max-w-md">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-950">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{tweet.replies}</span>
            </button>
            
            <button 
              onClick={() => toggleRetweet(tweet.id)}
              className={`flex items-center space-x-2 transition-colors group ${
                tweet.retweeted ? 'text-green-400' : 'text-gray-500 hover:text-green-400'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-green-950">
                <Repeat2 size={18} />
              </div>
              <span className="text-sm">{tweet.retweets}</span>
            </button>
            
            <button 
              onClick={() => toggleLike(tweet.id)}
              className={`flex items-center space-x-2 transition-colors group ${
                tweet.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-950">
                <Heart size={18} fill={tweet.liked ? 'currentColor' : 'none'} />
              </div>
              <span className="text-sm">{tweet.likes}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 transition-colors group">
              <div className="p-2 rounded-full group-hover:bg-blue-950">
                <Share size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-64 p-4 fixed h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              SocialFlow
            </h1>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-full transition-colors cursor-pointer ${
                  item.active 
                    ? 'bg-blue-900 text-blue-400' 
                    : 'hover:bg-gray-900 text-white hover:text-blue-400'
                }`}
              >
                <item.icon size={24} />
                <span className="text-xl font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
          
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full mt-8 transition-colors">
            Tweet
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 border-l border-r border-gray-800 min-h-screen">
          {/* Header */}
          <div className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-800 p-4">
            <h2 className="text-xl font-bold">Home</h2>
          </div>

          {/* Tweet Composer */}
          <div className="border-b border-gray-800 p-4">
            <div className="flex space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                YU
              </div>
              
              <div className="flex-1">
                <textarea
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full bg-transparent text-xl placeholder-gray-500 border-none outline-none resize-none"
                  rows="3"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <button className="text-blue-400 hover:bg-blue-950 p-2 rounded-full transition-colors">
                      <Image size={20} />
                    </button>
                    <button className="text-blue-400 hover:bg-blue-950 p-2 rounded-full transition-colors">
                      <Smile size={20} />
                    </button>
                    <button className="text-blue-400 hover:bg-blue-950 p-2 rounded-full transition-colors">
                      <Calendar size={20} />
                    </button>
                    <button className="text-blue-400 hover:bg-blue-950 p-2 rounded-full transition-colors">
                      <MapPin size={20} />
                    </button>
                  </div>
                  
                  <button
                    onClick={handleTweet}
                    disabled={!newTweet.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full transition-colors"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tweet Feed */}
          <div>
            {tweets.map(tweet => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-4">
          <div className="bg-gray-900 rounded-2xl p-4 mb-4">
            <h3 className="text-xl font-bold mb-3">What's happening</h3>
            <div className="space-y-3">
              <div className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                <p className="text-gray-500 text-sm">Trending in Technology</p>
                <p className="font-bold">React 19</p>
                <p className="text-gray-500 text-sm">42.1K Tweets</p>
              </div>
              <div className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                <p className="text-gray-500 text-sm">Trending in Design</p>
                <p className="font-bold">Tailwind CSS</p>
                <p className="text-gray-500 text-sm">28.5K Tweets</p>
              </div>
              <div className="hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
                <p className="text-gray-500 text-sm">Trending</p>
                <p className="font-bold">Modern Web</p>
                <p className="text-gray-500 text-sm">15.2K Tweets</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-4">
            <h3 className="text-xl font-bold mb-3">Who to follow</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    JD
                  </div>
                  <div>
                    <p className="font-bold">John Doe</p>
                    <p className="text-gray-500 text-sm">@johndoe</p>
                  </div>
                </div>
                <button className="bg-white text-black font-bold py-1 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  Follow
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                    MJ
                  </div>
                  <div>
                    <p className="font-bold">Maria Johnson</p>
                    <p className="text-gray-500 text-sm">@mariaj</p>
                  </div>
                </div>
                <button className="bg-white text-black font-bold py-1 px-4 rounded-full text-sm hover:bg-gray-200 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterClone;