const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const selectedDate = ref(new Date().toISOString().substr(0, 10)); // 今日の日付 
        const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9:00 - 18:00 
        const options = ['仕事', '勉強', '自由', '外出']; // プルダウン項目 
        const scheduleData = ref({});

        // 表示用の日付フォーマット
        const formattedDisplayDate = computed(() => {
            const d = new Date(selectedDate.value);
            return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日の週`;
        });

        // 基準日からその週の月曜日〜日曜日を算出 
        const weekDays = computed(() => {
            const current = new Date(selectedDate.value);
            const dayOfWeek = current.getDay(); // 0(日) - 6(土)
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            
            const days = [];
            const labels = ['月', '火', '水', '木', '金', '土', '日'];

            for (let i = 0; i < 7; i++) {
                const date = new Date(current);
                date.setDate(current.getDate() + diffToMonday + i);
                const dateStr = date.toISOString().substr(0, 10);
                days.push({
                    date: dateStr,
                    formattedDate: `${date.getMonth() + 1}/${date.getDate()}`,
                    label: labels[i]
                });
            }
            return days;
        });

        // LocalStorageからの読み込み 
        const loadSchedule = () => {
            const saved = localStorage.getItem('my_weekly_schedule');
            if (saved) {
                scheduleData.value = JSON.parse(saved);
            }
        };

        // LocalStorageへの保存 
        const saveSchedule = () => {
            localStorage.setItem('my_weekly_schedule', JSON.stringify(scheduleData.value));
        };

        const getStatusClass = (val) => {
            if (val === '仕事') return 'work';
            if (val === '勉強') return 'study';
            if (val === '自由') return 'free';
            if (val === '外出') return 'out';
            return '';
        };

        onMounted(loadSchedule);

        return {
            selectedDate,
            hours,
            options,
            scheduleData,
            weekDays,
            formattedDisplayDate,
            saveSchedule,
            getStatusClass
        };
    }
}).mount('#app');