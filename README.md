# GreenMeal - Sustainable Meal Planning Application

GreenMeal is a modern web application that helps users create sustainable meal plans while considering their dietary preferences and available ingredients. The application uses AI to generate personalized meal plans and provides carbon footprint calculations for each meal.

## 🌟 Features

- **AI-Powered Meal Planning**: Generate weekly meal plans using Google's Gemini AI
- **Carbon Footprint Tracking**: Calculate and monitor the environmental impact of your meals
- **Smart Ingredient Management**: Add and manage ingredients from your pantry
- **Personalized Recommendations**: Get meal suggestions based on your dietary preferences
- **Shopping List Generation**: Automatically create shopping lists based on your meal plan
- **Sustainable Tips**: Receive eco-friendly cooking and food storage advice

## 🛠️ Technologies Used

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI Integration**: Google Gemini AI API
- **Build Tool**: Vite
- **State Management**: React Context API
- **Authentication**: Custom authentication system

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/simyaid/greenmeal.git
cd greenmeal
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
VITE_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8081`

## 📁 Project Structure

```
greenmeal/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── pages/         # Application pages
│   ├── services/      # API and external service integrations
│   └── data/          # Mock data and constants
├── public/            # Static assets
└── ...
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_API_URL=http://localhost:5000
```

### API Integration

The application uses the Google Gemini AI API for:
- Meal plan generation
- Carbon footprint calculations
- Sustainable cooking tips
- Recipe analysis

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Google Gemini AI](https://ai.google.dev/) for the AI capabilities

## 📧 Contact

Project Link: [https://github.com/simyaid/greenmeal](https://github.com/yourusername/greenmeal)
