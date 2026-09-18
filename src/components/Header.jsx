import React from 'react';
import StaggeredMenu from './reactbits/StaggeredMenu';

const Header = ({ currentPage = 'home', onNavigate, onOpenInquiry }) => {
  const menuItems = [
    { 
      label: 'Home', 
      ariaLabel: 'Go to home page', 
      link: '/',
      onClick: () => {
        if (onNavigate) onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    { 
      label: 'About', 
      ariaLabel: 'About our studio manifesto and ethos', 
      link: '#about',
      onClick: () => {
        if (onNavigate) onNavigate('home');
        setTimeout(() => {
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    { 
      label: 'Gallery', 
      ariaLabel: 'Explore our visual portfolio gallery', 
      link: '#gallery',
      onClick: () => {
        if (onNavigate) onNavigate('home');
        setTimeout(() => {
          document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    { 
      label: 'Services', 
      ariaLabel: 'Explore our services', 
      link: '#services',
      onClick: () => {
        if (onNavigate) onNavigate('home');
        setTimeout(() => {
          document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    },
    { 
      label: 'Team', 
      ariaLabel: 'Meet our collective team', 
      link: '/team',
      onClick: () => {
        if (onNavigate) onNavigate('team');
      }
    },
    { 
      label: 'Inquire', 
      ariaLabel: 'Start a project with us', 
      link: '#contact',
      onClick: () => {
        if (onOpenInquiry) {
          onOpenInquiry();
        } else {
          if (onNavigate) onNavigate('home');
          setTimeout(() => {
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  ];

  const socialItems = [
    { label: 'Instagram', link: 'https://www.instagram.com/whyzo.ae?stkn=dnBnMWNkY3V0cWt0' },
    { label: 'YouTube', link: 'https://www.youtube.com/@Whyzocreatives' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com/in/whyzo-creatives-9b3212438/' },
    { label: 'Vimeo', link: 'https://vimeo.com' },
    { label: 'Twitter', link: 'https://x.com' }
  ];

  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials={true}
      displayItemNumbering={true}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen={true}
      colors={['#121212', '#222222']}
      accentColor="#ffffff"
      isFixed={true}
      logoUrl="/logo-white.png"
      currentPage={currentPage}
      onNavigate={onNavigate}
    />
  );
};

export default Header;
