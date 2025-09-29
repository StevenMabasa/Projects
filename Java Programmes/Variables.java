import java.util.Date;

public class Variables {

    public static void main(String[] args) {
        int age = 18;
        String name = "Steven";
        String surname = new String("Mabasa");
        String fullname = name + " " + surname;
        Date today = new Date();
        long views = 3_123_456_789L;  //we add the L/l so that the java compiler can recognize the the number as a type long instead of int
        System.out.println(name);
        System.out.println(surname);
        System.out.println(fullname);
        System.out.println(age);
        System.out.println(views);
        System.out.println(today);
    }
    
}
