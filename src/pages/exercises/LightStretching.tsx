import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Feather, Clock, CheckCircle } from 'lucide-react';

interface StretchExercise {
  title: string;
  description: string;
  duration: string;
  steps: string[];
  image: string;
}

const LightStretching: React.FC = () => {
  const navigate = useNavigate();
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const exercises: StretchExercise[] = [
    {
      title: 'Neck & Shoulder Release',
      description: 'Gentle movements to release tension in the neck and shoulders.',
      duration: '2-3 minutes',
      steps: [
        'Sit comfortably with your back straight',
        'Slowly tilt your head to the right, bringing your ear toward your shoulder',
        'Hold for 15-30 seconds, feeling a gentle stretch in the left side of your neck',
        'Return to center, then repeat on the left side',
        'Roll your shoulders backward 5 times in a circular motion',
        'Roll your shoulders forward 5 times in a circular motion',
        'Finish by gently tilting your head down, bringing your chin toward your chest'
      ],
      image: 'https://images.pexels.com/photos/5617179/pexels-photo-5617179.jpeg'
    },
    {
      title: 'Seated Spinal Twist',
      description: 'A gentle twist to release tension in the back and improve spinal mobility.',
      duration: '2 minutes',
      steps: [
        'Sit on the edge of a chair with your feet flat on the floor',
        'Place your right hand on your left knee',
        'Place your left hand behind you on the seat or back of the chair',
        'Inhale to lengthen your spine',
        'Exhale and gently twist to the left, looking over your left shoulder',
        'Hold for 3-5 breaths, then return to center',
        'Repeat on the other side'
      ],
      image: 'https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg'
    },
    {
      title: 'Gentle Arm Stretches',
      description: 'Release tension in your arms and improve circulation.',
      duration: '2 minutes',
      steps: [
        'Extend your right arm in front of you',
        'Use your left hand to gently pull your right fingers back toward your body',
        'Hold for 15-30 seconds, feeling the stretch in your forearm',
        'Switch hands and repeat',
        'Next, extend your right arm across your chest',
        'Use your left hand to gently pull your right arm closer to your body',
        'Hold for 15-30 seconds, then switch sides'
      ],
      image: 'https://images.pexels.com/photos/6787204/pexels-photo-6787204.jpeg'
    },
    {
      title: 'Ankle and Foot Circles',
      description: 'Improve circulation in the lower extremities.',
      duration: '1-2 minutes',
      steps: [
        'Sit in a comfortable position',
        'Lift your right foot slightly off the ground',
        'Rotate your ankle clockwise 5 times',
        'Rotate your ankle counterclockwise 5 times',
        'Repeat with your left foot',
        'Gently point and flex both feet 5 times',
        'Finish by wiggling your toes for 5-10 seconds'
      ],
      image: 'https://images.pexels.com/photos/6787226/pexels-photo-6787226.jpeg'
    }
  ];

  const markComplete = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises([...completedExercises, index]);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-pink-800 flex items-center">
            <Feather className="h-6 w-6 mr-2" />
            Light Stretching Exercises
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Why Light Stretching Helps</h2>
          <p className="text-gray-700 mb-4">
            Gentle stretching can help alleviate muscle tension, improve circulation, and promote relaxation during your 
            chemotherapy journey. These simple exercises are designed to be gentle enough for when your energy is low, 
            but effective for providing relief.
          </p>
          <div className="bg-pink-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-pink-800 mb-2">Benefits:</h3>
            <ul className="list-disc pl-5 text-pink-900">
              <li>Reduces muscle tension and stiffness</li>
              <li>Improves circulation and oxygen flow</li>
              <li>Provides a gentle energy boost</li>
              <li>Helps manage stress and anxiety</li>
              <li>Can be done from a seated position if needed</li>
            </ul>
          </div>
        </div>

        {/* Exercise List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {exercises.map((exercise, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 ${
                completedExercises.includes(index) ? 'border-2 border-green-500' : ''
              }`}
              onClick={() => setCurrentExercise(index)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={exercise.image} 
                  alt={exercise.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-pink-800">{exercise.title}</h3>
                  {completedExercises.includes(index) && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-2">{exercise.description}</p>
                <div className="flex items-center text-pink-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{exercise.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Exercise Details Modal */}
        {currentExercise !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="h-64 overflow-hidden">
                <img 
                  src={exercises[currentExercise].image} 
                  alt={exercises[currentExercise].title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-pink-800 mb-2">{exercises[currentExercise].title}</h3>
                <div className="flex items-center mb-4 text-pink-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{exercises[currentExercise].duration}</span>
                </div>
                <p className="text-gray-700 mb-4">{exercises[currentExercise].description}</p>
                
                <h4 className="text-lg font-semibold text-pink-800 mb-2">Steps:</h4>
                <ol className="list-decimal pl-6 space-y-2 mb-6">
                  {exercises[currentExercise].steps.map((step, i) => (
                    <li key={i} className="text-gray-700">{step}</li>
                  ))}
                </ol>
                
                <div className="bg-pink-50 p-4 rounded-lg mb-6">
                  <p className="text-pink-800 italic">
                    Remember to breathe deeply and move slowly. Never stretch to the point of pain. 
                    If you feel discomfort at any point, ease back or stop the exercise.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentExercise(null)}
                    className="px-4 py-2 border border-pink-600 text-pink-600 rounded-md hover:bg-pink-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      markComplete(currentExercise);
                      setCurrentExercise(null);
                    }}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Tips for Safe Stretching</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mt-1">
                <CheckCircle className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-pink-800">Move slowly and gently</h3>
                <p className="text-gray-700">Avoid jerky or bouncy movements. Move into each stretch slowly and hold without bouncing.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mt-1">
                <CheckCircle className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-pink-800">Breathe deeply</h3>
                <p className="text-gray-700">Remember to breathe normally during stretches. Try to exhale as you deepen a stretch.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mt-1">
                <CheckCircle className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-pink-800">Listen to your body</h3>
                <p className="text-gray-700">If something hurts or feels uncomfortable, stop immediately. You should feel a gentle stretch, never pain.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-pink-100 p-2 rounded-full mt-1">
                <CheckCircle className="h-5 w-5 text-pink-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg text-pink-800">Be consistent</h3>
                <p className="text-gray-700">Even a few minutes of gentle stretching each day can help maintain flexibility and reduce tension.</p>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default LightStretching; 